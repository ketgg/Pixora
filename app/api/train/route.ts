import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const SITE_URL =
  process.env.PIXORA_SITE_URL || "https://749f-103-37-201-226.ngrok-free.app/"

export const POST = async (request: NextRequest) => {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is not set.")
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 })
    }

    const inputParams = await request.json()
    // console.log("@INPUT_PARAMS", inputParams)
    if (!inputParams.fileKey || !inputParams.modelName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    const fileName = inputParams.fileKey.replace("TrainingData/", "")
    const { data: fileUrl } = await supabaseAdmin.storage
      .from("TrainingData")
      .createSignedUrl(fileName, 3600)
    if (!fileUrl?.signedUrl) {
      throw new Error("Failed to get the file URL.")
    }

    // Create Model in Replicate
    const modelId = `${user.id}_${Date.now()}_${inputParams.modelName.toLowerCase().replaceAll(" ", "-")}`
    await replicate.models.create("ketgg", modelId, {
      visibility: "private",
      hardware: "gpu-a100-large",
    })
    // Start Training
    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "f754b6d9684dd83291baa1a7f417bbc176ff5515a2a4d45930ed73a075876d4b",
      {
        // You need to create a model on Replicate that will be the destination for the trained version.
        destination: `ketgg/${modelId}`,
        input: {
          steps: inputParams.steps || 1000,
          lora_rank: inputParams.loraRank || 16,
          optimizer: inputParams.optimizer || "adamw8bit",
          batch_size: inputParams.batchSize || 1,
          resolution: inputParams.resolution || "512,768,1024",
          autocaption: inputParams.autocaption || true,
          autocaption_prefix: inputParams.autocaptionPrefix,
          autocaption_suffix: inputParams.autocaptionSuffix,
          input_images: fileUrl.signedUrl,
          trigger_word: inputParams.triggerWord || "TOK",
          learning_rate: inputParams.learningRate || 0.0004,
          caption_dropout_rate: inputParams.captionDropoutRate || 0.05,
          cache_latents_to_disk: inputParams.cacheLatentsToDisk || false,
          layers_to_optimize_regex: inputParams.layersToOptimizeRegex || "",
          gradient_checkpointing: inputParams.gradientCheckpointing || false,
        },
        webhook: `${SITE_URL}/api/webhooks/training`,
        webhook_events_filter: ["completed"],
      },
    )
    // console.log("@TRAINING_DATA", training)

    // Add model to database
    const dbRes = await supabaseAdmin.from("Models").insert({
      userId: user.id,
      modelId: modelId,
      modelName: inputParams.modelName,
      triggerWord: inputParams.triggerWord || "TOK",
      autocaption: inputParams.autocaption || true,
      autocaptionPrefix: inputParams.autocaptionPrefix || "",
      autocaptionSuffix: inputParams.autocaptionSuffix || "",
      trainingSteps: inputParams.steps || 1000,
      trainingBatchSize: inputParams.batchSize || 1,
      learningRate: inputParams.learningRate || 0.0004,
      loraRank: inputParams.loraRank || 16,
      resolution: inputParams.resolution || "512,768,1024",
      captionDropoutRate: inputParams.captionDropoutRate || 0.05,
      optimizer: inputParams.optimizer || "adamw8bit",
      cacheLatentsToDisk: inputParams.cacheLatentsToDisk || false,
      layersToOptimizeRegex: inputParams.layersToOptimizeRegex || "",
      gradientCheckpointing: inputParams.gradientCheckpointing || false,
      trainingId: training.id,
      trainingStatus: training.status.toUpperCase(),
    })
    // console.log("@DB_RES", dbRes)
    if (dbRes.error) {
      throw new Error("Failed to upload model details in the database")
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error(error)
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Something went wrong in model training!"
    return NextResponse.json(
      {
        error: errorMsg,
      },
      { status: 500 },
    )
  }
}
