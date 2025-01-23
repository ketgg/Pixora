"use server"

import { imageMeta } from "image-meta"
import { randomUUID } from "crypto"

import { createClient } from "@/lib/supabase/server"
import { Database } from "@/types/database"

export type StoreImagesDataType =
  (Database["public"]["Tables"]["GeneratedImages"]["Insert"] & {
    url: string
  })[]

export const imgUrlToBlob = async (url: string) => {
  const response = await fetch(url)
  const blob = await response.blob()
  return await blob.arrayBuffer()
}

export const storeImages = async (data: StoreImagesDataType) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return {
      error: "Unauthenticated",
      success: false,
      data: null,
    }
  }

  const uploadResults = []

  for (const genObj of data) {
    const arrayBuffer = await imgUrlToBlob(genObj.url)
    const { width, height, type } = imageMeta(new Uint8Array(arrayBuffer))

    const fileName = `genImg_${randomUUID()}.${type}`
    const filePath = `${user.id}/${fileName}`

    const { error: storageError } = await supabase.storage
      .from("GeneratedImages")
      .upload(filePath, arrayBuffer, {
        contentType: `image/${type}`,
        cacheControl: "3600",
        upsert: false,
      })

    if (storageError) {
      uploadResults.push({
        fileName,
        error: storageError.message,
        success: false,
        data: null,
      })
      continue
    }

    const { data: dbData, error: dbError } = await supabase
      .from("GeneratedImages")
      .insert({
        userId: user.id,
        modelName: genObj.modelName,
        imageName: fileName,
        prompt: genObj.prompt,
        outputFormat: genObj.outputFormat,
        outputQuality: genObj.outputQuality,
        WIDTH: width,
        HEIGHT: height,
        aspectRatio: genObj.aspectRatio,
        guidance: genObj.guidance,
        numOfInferenceSteps: genObj.numOfInferenceSteps,
        goFast: genObj.goFast,
        megapixels: genObj.megapixels,
      })
      .select()

    if (dbError) {
      uploadResults.push({
        fileName,
        error: dbError.message,
        success: !dbError,
        data: dbData || null,
      })
    }
  }

  console.log("@DEBUG", uploadResults)

  return {
    error: null,
    success: true,
    data: { results: uploadResults },
  }
}
