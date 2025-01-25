import { NextResponse } from "next/server"
import { Resend } from "resend"
import Replicate from "replicate"
import crypto from "crypto"
import { supabaseAdmin } from "@/lib/supabase/admin"

import PixoraModelTrainingResultEmail, {
  statusType,
} from "@/components/resend/pixora-email-template"

import { Database } from "@/types/database"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const resend = new Resend(process.env.RESEND_API_TOKEN)

const verifyWebhook = async (request: Request, body: any): Promise<boolean> => {
  const webhookId = request.headers.get("webhook-id") ?? ""
  const webhookTimestamp = request.headers.get("webhook-timestamp") ?? ""
  const webhookSignature = request.headers.get("webhook-signature") ?? ""

  const signedContent = `${webhookId}.${webhookTimestamp}.${JSON.stringify(body)}`
  const secret = await replicate.webhooks.default.secret.get()
  const secretBytes = Buffer.from(secret.key.split("_")[1], "base64")
  const computedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64")

  const expectedSignatures = webhookSignature
    .split(" ")
    .map((sig) => sig.split(",")[1])

  return expectedSignatures.some(
    (expectedSignature) => expectedSignature === computedSignature,
  )
}

// Helper function to send emails
const sendEmail = async ({
  userFullName,
  userEmail,
  subject,
  status,
}: {
  userFullName: string
  userEmail: string
  subject: string
  status: statusType
}) => {
  try {
    await resend.emails.send({
      from: "Pixora <onboarding@resend.dev>",
      to: [userEmail],
      subject,
      react: PixoraModelTrainingResultEmail({
        userFullName,
        genImgLink: status === "SUCCEEDED" ? "/generate" : undefined,
        status,
      }),
    })
  } catch (error) {
    console.error(`Failed to send email for status: ${status}`, error)
  }
}

// Helper function to update the model status in Supabase
const updateModelStatus = async ({
  userId,
  modelName,
  status,
  trainingTime,
  version,
}: {
  userId: string
  modelName: string
  status: Database["public"]["Tables"]["Models"]["Row"]["trainingStatus"]
  trainingTime?: string
  version?: string
}) => {
  try {
    await supabaseAdmin
      .from("Models")
      .update({
        trainingStatus: status,
        trainingTime: trainingTime ?? null,
        VERSION: version ? version.split(":")[1] : null,
      })
      .eq("userId", userId)
      .eq("modelName", modelName)
  } catch (error) {
    console.error(`Failed to update model status to: ${status}`, error)
  }
}

// Helper function to delete training data from Supabase
const deleteTrainingData = async (filePath: string) => {
  try {
    await supabaseAdmin.storage.from("TrainingData").remove([`${filePath}`])
  } catch (error) {
    console.error("Failed to delete training data", error)
  }
}

type BodyStatus = "succeeded" | "failed" | "canceled" | "processing"

const statusHandlers = {
  succeeded: async ({
    userFullName,
    userEmail,
    userId,
    modelName,
    filePath,
    body,
  }: {
    userFullName: string
    userEmail: string
    userId: string
    modelName: string
    filePath: string
    body: any
  }) => {
    console.log("@HANDLE_SUCCEEDED")
    await sendEmail({
      userFullName,
      userEmail,
      subject: "Model Training Succeeded",
      status: "SUCCEEDED",
    })
    await updateModelStatus({
      userId,
      modelName,
      status: "SUCCEEDED",
      trainingTime: body.metrics?.predict_time.toString(),
      version: body.output?.version.split(":")[1],
    })
    await deleteTrainingData(filePath)
  },
  failed: async ({
    userFullName,
    userEmail,
    userId,
    modelName,
    filePath,
  }: {
    userFullName: string
    userEmail: string
    userId: string
    modelName: string
    filePath: string
  }) => {
    console.log("@HANDLE_FAILED")
    await sendEmail({
      userFullName,
      userEmail,
      subject: "Model Training Failed",
      status: "FAILED",
    })
    await updateModelStatus({
      userId,
      modelName,
      status: "FAILED",
    })
    await deleteTrainingData(filePath)
  },
  canceled: async ({
    userFullName,
    userEmail,
    userId,
    modelName,
    filePath,
  }: {
    userFullName: string
    userEmail: string
    userId: string
    modelName: string
    filePath: string
  }) => {
    console.log("@HANDLE_CANCELED")
    await sendEmail({
      userFullName,
      userEmail,
      subject: "Model Training Canceled",
      status: "CANCELED",
    })
    await updateModelStatus({
      userId,
      modelName,
      status: "CANCELED",
    })
    await deleteTrainingData(filePath)
  },
  processing: async ({
    userFullName,
    userEmail,
    userId,
    modelName,
  }: {
    userFullName: string
    userEmail: string
    userId: string
    modelName: string
  }) => {
    console.log("@HANDLE_PROCESSING")
    await sendEmail({
      userFullName,
      userEmail,
      subject: "Model Training Started",
      status: "PROCESSING",
    })
    await updateModelStatus({
      userId,
      modelName,
      status: "PROCESSING",
    })
  },
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    console.log("@WEBHOOK_BODY", body)

    const url = new URL(request.url)
    const userId = url.searchParams.get("user-id") ?? ""
    const modelName = url.searchParams.get("model-name") ?? ""
    const filePath = url.searchParams.get("file-path") ?? ""

    // Verify webhook
    const isValid = await verifyWebhook(request, body)
    if (!isValid) {
      return new NextResponse("Invalid signature.", { status: 401 })
    }

    // Get user data
    const { data: userData, error: getUserErr } =
      await supabaseAdmin.auth.admin.getUserById(userId)
    if (getUserErr || !userData) {
      return new NextResponse("User not found.", { status: 401 })
    }

    const userEmail = userData.user.email ?? ""
    const userFullName = userData.user.user_metadata.fullName ?? ""

    // Handle based on the training status
    const handler = statusHandlers[body.status as BodyStatus]
    if (handler) {
      await handler({
        userFullName,
        userEmail,
        userId,
        modelName,
        filePath,
        body,
      })
    } else {
      console.error(`Unknown status: ${body.status}`)
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("Error handling webhook", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
