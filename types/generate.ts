import { Tables } from "@/types/database"

export type GenImgType = Tables<"GeneratedImages"> & { url: string | undefined }
