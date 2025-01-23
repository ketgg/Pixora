import { create } from "zustand"
import { string, z } from "zod"
import { formSchema } from "@/app/(dashboard)/generate-image/_components/input-params"
import { generateImages as generateImagesAction } from "@/actions/generate"

type GeneratedState = {
  loading: boolean
  images: { url: string }[]
  error: any | null
  generateImages: (values: z.infer<typeof formSchema>) => Promise<void>
}

export const useGeneratedStore = create<GeneratedState>((set) => ({
  loading: false,
  images: [],
  error: null,

  generateImages: async (values: z.infer<typeof formSchema>) => {
    set({ loading: true, error: null })
    try {
      const { error, success, data } = await generateImagesAction(values)
      if (!success) {
        set({ error: error, loading: false })
        return
      }
      console.log({ error, success, data })

      if (data) set({ images: data.map((url: string) => ({ url })) })
      set({ loading: false })
    } catch (error: any) {
      console.error("Error in generateImages:", error)
      set({
        error: "Failed to generate image(s). Please try again later",
        loading: false,
      })
    }
  },
}))
