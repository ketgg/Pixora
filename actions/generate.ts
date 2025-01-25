"use server"

import Replicate from "replicate"
import { z } from "zod"
import { formSchema } from "@/app/(dashboard)/generate/_components/input-params"
import { REPLICATE_USERNAME } from "@/constants/replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
})

type GenerateImageResponse = {
  error: any | null
  success: boolean
  data: string[] | null
}

export const generateImages = async (
  values: z.infer<typeof formSchema>,
): Promise<GenerateImageResponse> => {
  const modelName = values.modelName
  const isCustomModel = modelName.startsWith(REPLICATE_USERNAME)
  const isFluxDev = modelName === "black-forest-labs/flux-dev"
  const PROMPT_STRENGTH = 0.8

  const sharedParams = {
    prompt: values.prompt,
    go_fast: values.goFast,
    megapixels: values.megapixels,
    num_outputs: values.numOfOutputs,
    aspect_ratio: values.aspectRatio,
    output_format: values.outputFormat,
    output_quality: values.outputQuality,
    num_inference_steps: values.numOfInferenceSteps,
  }

  const modelInputParams = isCustomModel
    ? {
        ...sharedParams,
        model: "dev",
        guidance_scale: values.guidanceScale,
        lora_scale: values.loraScale,
        extra_lora_scale: 1,
        prompt_strength: PROMPT_STRENGTH,
      }
    : isFluxDev
      ? {
          ...sharedParams,
          guidance: values.guidance,
          prompt_strength: PROMPT_STRENGTH,
        }
      : sharedParams

  // console.log("@DEBUG", modelName, modelInputParams)
  try {
    const result = await replicate.run(modelName as `${string}/${string}`, {
      input: modelInputParams,
    })
    // console.log("@ACTION:", result)
    // We get an array of image url's
    return {
      error: null,
      success: true,
      data: result as [],
    }
  } catch (error: any) {
    // console.log("@ERROR in generateImages:", error)
    return {
      error: error.message || "Something went wrong in generateImages",
      success: false,
      data: null,
    }
  }
}
