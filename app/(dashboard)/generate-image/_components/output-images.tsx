import React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

type Props = {}

const images = [
  { src: "/dummy/1.jpg", alt: "1" },
  { src: "/dummy/2.jpg", alt: "2" },
  { src: "/dummy/3.jpg", alt: "3" },
  { src: "/dummy/4.jpg", alt: "4" },
]

const OutputImages = (props: Props) => {
  return (
    <div className="w-full px-12">
      <Carousel className="w-full">
        <CarouselContent>
          {images.length === 0 && (
            <CarouselItem>
              <Card className="w-full items-center rounded-lg bg-muted shadow-none">
                <CardContent className="flex aspect-square items-center justify-center">
                  <span className="font-freigeist text-base">
                    No images generated
                  </span>
                </CardContent>
              </Card>
            </CarouselItem>
          )}
          {images.length !== 0 &&
            images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative">
                  <Card className="rounded-lg">
                    <CardContent className="flex aspect-square items-center justify-center">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
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
