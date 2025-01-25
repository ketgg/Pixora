import { create } from "zustand"
import { z } from "zod"
import { toast } from "sonner"

import { formSchema } from "@/app/(dashboard)/generate/_components/input-params"
import { generateImages as generateImagesAction } from "@/actions/generate"
import { storeImages } from "@/actions/storage"

type GeneratedState = {
  loading: boolean
  images: { url: string }[]
  error: any | null
  generateImages: (values: z.infer<typeof formSchema>) => Promise<void>
  reset: () => void // Add a reset action
}

export const useGeneratedStore = create<GeneratedState>((set) => ({
  loading: false,
  images: [],
  error: null,

  generateImages: async (values: z.infer<typeof formSchema>) => {
    set({ loading: true, error: null })
    const toastId = values.prompt
    try {
      toast.loading(
        `Generating ${values.numOfOutputs > 1 ? "images" : "image"}...`,
        { id: toastId },
      )
      const { error, success, data } = await generateImagesAction(values)
      // console.log({ error, success, data })
      if (!success) {
        set({ error: error, loading: false })
        toast.error(error, { id: toastId })
        return
      }

      let dataWithUrl
      if (data) {
        dataWithUrl = data.map((url: string) => {
          return { url, ...values }
        })
        set({ images: dataWithUrl })
        toast.success(
          `${values.numOfOutputs > 1 ? "Images" : "Image"} generated successfully!`,
          { id: toastId },
        )
      }
      set({ loading: false })

      if (dataWithUrl) await storeImages(dataWithUrl)
    } catch (error: any) {
      console.error("Error in generateImages:", error)
      set({
        error: "Failed to generate image(s). Please try again later",
        loading: false,
      })
      toast.error("Something went wrong. Please try again later.", {
        id: toastId,
      })
    }
  },

  reset: () => {
    set({ images: [], loading: false, error: null })
  },
}))
