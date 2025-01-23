"use server"

import Replicate from "replicate"
import { z } from "zod"
import { formSchema } from "@/app/(dashboard)/generate-image/_components/input-params"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
})

type GenerateImageResponse = {
  error: string | null
  success: boolean
  data: unknown | null
}

export const generateImage = async ({
  model,
  prompt,
  aspect_ratio,
  num_outputs,
  num_inference_steps,
  guidance,
  output_format,
  output_quality,
  go_fast,
  megapixels,
}: z.infer<typeof formSchema>) => {
  const schnellModelInput = {
    prompt,
    go_fast,
    megapixels,
    num_outputs,
    aspect_ratio,
    output_format,
    output_quality,
    num_inference_steps,
  }
  const devModelInput = {
    prompt,
    go_fast,
    guidance,
    megapixels,
    num_outputs,
    aspect_ratio,
    output_format,
    output_quality,
    prompt_strength: 0.8,
    num_inference_steps,
  }
  console.log("@SCHNELL", schnellModelInput)
  console.log("@DEV", devModelInput)
}
