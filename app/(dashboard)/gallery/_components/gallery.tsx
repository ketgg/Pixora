"use client"

import Image from "next/image"
import React from "react"
import { Masonry } from "react-plock"

import SheetWrapper from "./sheet-wrapper"

import { GenImgType } from "@/types/generate"

type Props = {
  images: GenImgType[]
}

const Gallery = ({ images }: Props) => {
  if (images.length === 0) {
    return (
      <div className="font-grotesk flex text-muted-foreground">
        No Images Found
      </div>
    )
  }
  return (
    <section className="mx-auto">
      <Masonry
        items={images}
        config={{
          columns: [1, 2, 3, 4],
          gap: [16, 12, 12, 12],
          media: [640, 768, 1024, 1280],
        }}
        render={(img, idx) => {
          return (
            <SheetWrapper img={img}>
              <div
                key={idx}
                className="group relative cursor-pointer overflow-hidden transition-transform"
              >
                <div className="absolute inset-0 z-10 bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-70">
                  <div className="flex h-full items-center justify-center">
                    <p className="font-grotesk text-lg text-primary-foreground">
                      View Details
                    </p>
                  </div>
                </div>

                <Image
                  src={img.url || ""}
                  alt="Pixora Image"
                  width={img.WIDTH || 0}
                  height={img.HEIGHT || 0}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </div>
            </SheetWrapper>
          )
        }}
      />
    </section>
  )
}

export default Gallery
