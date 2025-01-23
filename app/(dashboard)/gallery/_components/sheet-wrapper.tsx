"use client"

import Image from "next/image"
import React, { useEffect, useState } from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { GenImgType } from "@/types/generate"
import { RiDownloadLine } from "@remixicon/react"
import { Badge } from "@/components/ui/badge"

import DeleteDialog from "./delete-dialog"

type Props = {
  img: GenImgType
  children: React.ReactNode
}

const SheetWrapper = ({ img, children }: Props) => {
  const [isDelPending, setIsDelPending] = useState(false)
  const handleDownload = () => {
    fetch(img.url || "")
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute(
          "download",
          `Pixoria_Img_${Date.now()}.${img.outputFormat}`,
        )
        document.body.appendChild(link)
        link.click()
        // Cleanup
        link.parentNode?.removeChild(link)
      })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full max-w-full flex-col gap-2 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-freigeist">Image Details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100vh]">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 border-b border-border pb-2">
              <Image
                src={img.url || ""}
                alt="Pixora Image"
                width={img.WIDTH || 0}
                height={img.HEIGHT || 0}
              />
              <div className="flex gap-2 font-freigeist">
                <Button
                  onClick={handleDownload}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <RiDownloadLine />
                  <span>Download</span>
                </Button>
                <DeleteDialog
                  isPending={isDelPending}
                  setIsPending={setIsDelPending}
                  imageId={img.id.toString()}
                  imageName={img.imageName || ""}
                />
              </div>
            </div>
            <Badge
              variant={"outline"}
              className="flex items-center gap-1 text-sm font-normal"
            >
              <span className="font-mono">prompt:</span>
              <span className="font-freigeist">{img.prompt}</span>
            </Badge>
            <div className="flex flex-wrap gap-2 font-mono">
              <Badge
                variant={"outline"}
                className="flex items-center gap-1 text-sm font-normal"
              >
                <span className="font-mono">model:</span>
                <span className="font-freigeist">{img.modelName}</span>
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-1 text-sm font-normal"
              >
                <span className="font-mono">output_format:</span>
                <span className="font-freigeist">{img.outputFormat}</span>
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-1 text-sm font-normal"
              >
                <span className="font-mono">aspect_ratio:</span>
                <span className="font-freigeist">{img.aspectRatio}</span>
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-1 text-sm font-normal"
              >
                <span className="font-mono">output_quality:</span>
                <span className="font-freigeist">{img.outputQuality}</span>
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-1 text-sm font-normal"
              >
                <span className="font-mono">num_inference_steps:</span>
                <span className="font-freigeist">
                  {img.numOfInferenceSteps}
                </span>
              </Badge>
              {img.modelName === "black-forest-labs/flux-dev" && (
                <Badge
                  variant={"outline"}
                  className="flex items-center gap-1 text-sm font-normal"
                >
                  <span className="font-mono">guidance:</span>
                  <span className="font-freigeist">{img.guidance}</span>
                </Badge>
              )}
              <Badge
                variant={"outline"}
                className="flex items-center gap-1 text-sm font-normal"
              >
                <span className="font-mono">go_fast:</span>
                <span className="font-freigeist">
                  {img.goFast ? "true" : "false"}
                </span>
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-1 text-sm font-normal"
              >
                <span className="font-mono">megapixels:</span>
                <span className="font-freigeist">{img.megapixels}</span>
              </Badge>
            </div>
          </div>

          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default SheetWrapper
