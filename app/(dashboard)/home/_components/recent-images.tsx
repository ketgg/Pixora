import Link from "next/link"
import Image from "next/image"
import React from "react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

import { Tables, Database } from "@/types/database"
import { RiArrowRightBoxLine, RiArrowRightLine } from "@remixicon/react"

export type RecentImagesProps = {
  images: (Database["public"]["Tables"]["GeneratedImages"]["Row"] & {
    url: string | undefined
  })[]
}

const RecentImages = ({ images }: RecentImagesProps) => {
  if (images.length === 0) {
    return (
      <Card className="col-span-full rounded-lg shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <p className="text-muted-foreground">No images generated yet.</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="col-span-full rounded-lg shadow-sm lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Generations</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                <div className="space-y-2">
                  <div
                    className={cn(
                      "relative overflow-hidden",
                      image.HEIGHT && image.WIDTH
                        ? `aspect-[${image.WIDTH}/${image.HEIGHT}]`
                        : "aspect-square",
                    )}
                  >
                    <Image
                      src={image.url || ""}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      alt={image.prompt || "Generated Image using Pixora"}
                      width={image.WIDTH || 100}
                      height={image.HEIGHT || 100}
                    />
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {image.prompt}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="flex justify-end">
          <Link href="/gallery">
            <Button variant="ghost">
              View gallery <RiArrowRightLine size={16} />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentImages
