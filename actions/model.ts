"use server"
import { REPLICATE_USERNAME } from "@/constants/replicate"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export const getUserTrainedModels = async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error, count } = await supabase
    .from("Models")
    .select("*", { count: "exact" })
    .eq("userId", user?.id)
    .order("createdAt", { ascending: false })

  return {
    error: error?.message || null,
    success: !error,
    data: data || null,
    count: count || 0,
  }
}

export const deleteModel = async (
  id: number,
  modelId: string,
  modelVersion: string,
) => {
  const supabase = await createClient()

  // Delete model version first
  // if (modelVersion) {
  //   try {
  //     const res = await fetch(
  //       `https://api.replicate.com/v1/models/${REPLICATE_USERNAME}/${modelId}/versions/${modelVersion}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
  //         },
  //       },
  //     )
  //     if (!res.ok) {
  //       throw new Error("Failed to delete model version from Replicate.")
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete model version", error)
  //     return {
  //       error: "Failed to delete model version from Replicate.",
  //       success: false,
  //     }
  //   }
  // }

  // Delete model
  // if (modelId) {
  //   try {
  //     const res = await fetch(
  //       `https://api.replicate.com/v1/models/${REPLICATE_USERNAME}/${modelId}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
  //         },
  //       },
  //     )
  //     if (!res.ok) {
  //       throw new Error("Failed to delete the model from Replicate.")
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete the model", error)
  //     return {
  //       error: "Failed to delete the model from Replicate.",
  //       success: false,
  //     }
  //   }
  // }

  // Delete from supabase
  const { error } = await supabase.from("Models").delete().eq("id", id)

  revalidatePath("/models")

  if (error) {
    return {
      error: error?.message || "Failed to delete the model.",
      success: false,
    }
  }
  return {
    error: null,
    success: true,
  }
}
