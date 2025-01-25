"use client"

import Image from "next/image"
import React, { useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"

import { useGeneratedStore } from "@/store/use-generated-store"

type Props = {}

// const images = [
//   { src: "/dummy/1.jpg", alt: "1" },
//   { src: "/dummy/2.jpg", alt: "2" },
//   { src: "/dummy/3.jpg", alt: "3" },
//   { src: "/dummy/4.jpg", alt: "4" },
// ]

const OutputImages = (props: Props) => {
  const images = useGeneratedStore((state) => state.images)
  const loading = useGeneratedStore((state) => state.loading)
  const reset = useGeneratedStore((state) => state.reset)
  // Reset the state when the component unmounts
  useEffect(() => {
    return () => {
      reset() // Call the reset action
    }
  }, [reset])

  return (
    <div className="w-full px-12">
      <Carousel className="w-full">
        <CarouselContent>
          {images.length === 0 && (
            <CarouselItem>
              <Card className="w-full items-center rounded-lg bg-muted shadow-none">
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <span className="font-freigeist text-base">
                      No images generated
                    </span>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          )}
          {images.length !== 0 &&
            images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative">
                  <Card className="rounded-lg">
                    <CardContent className="relative flex aspect-square items-center justify-center p-0">
                      {loading ? (
                        <Skeleton className="h-full w-full" />
                      ) : (
                        <Image
                          src={image.url}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          alt="Generated image using Pixora"
                          fill
                          className="object-cover"
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default OutputImages
