import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"

import React from "react"
import { RiArrowRightSLine, RiArrowRightLine } from "@remixicon/react"

import { cn } from "@/lib/utils"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"

import { Marquee } from "../ui/marquee"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"

type Props = {}

const avatars = [
  { src: "/avatars/01.jpg", fallback: "CN" },
  { src: "/avatars/02.jpg", fallback: "AB" },
  { src: "/avatars/03.jpg", fallback: "FG" },
  { src: "/avatars/04.jpg", fallback: "PW" },
  { src: "/avatars/05.jpg", fallback: "RC" },
  { src: "/avatars/06.jpg", fallback: "JB" },
]

const images = [
  { src: "/images/01.png", alt: "AI Generated Image" },
  { src: "/images/02.png", alt: "AI Generated Image" },
  { src: "/images/03.png", alt: "AI Generated Image" },
  { src: "/images/04.png", alt: "AI Generated Image" },
  { src: "/images/05.png", alt: "AI Generated Image" },
  { src: "/images/06.png", alt: "AI Generated Image" },
  { src: "/images/07.png", alt: "AI Generated Image" },
  { src: "/images/08.png", alt: "AI Generated Image" },
  { src: "/images/09.png", alt: "AI Generated Image" },
  { src: "/images/10.png", alt: "AI Generated Image" },
  { src: "/images/11.png", alt: "AI Generated Image" },
  { src: "/images/12.png", alt: "AI Generated Image" },
  { src: "/images/13.png", alt: "AI Generated Image" },
  { src: "/images/14.png", alt: "AI Generated Image" },
  { src: "/images/15.png", alt: "AI Generated Image" },
  { src: "/images/16.png", alt: "AI Generated Image" },
  { src: "/images/17.png", alt: "AI Generated Image" },
  { src: "/images/18.png", alt: "AI Generated Image" },
  { src: "/images/19.png", alt: "AI Generated Image" },
  { src: "/images/20.png", alt: "AI Generated Image" },
  { src: "/images/21.png", alt: "AI Generated Image" },
  { src: "/images/22.png", alt: "AI Generated Image" },
  { src: "/images/23.png", alt: "AI Generated Image" },
  { src: "/images/24.png", alt: "AI Generated Image" },
  { src: "/images/25.png", alt: "AI Generated Image" },
  { src: "/images/26.png", alt: "AI Generated Image" },
  { src: "/images/27.png", alt: "AI Generated Image" },
  { src: "/images/28.png", alt: "AI Generated Image" },
  { src: "/images/29.png", alt: "AI Generated Image" },
  { src: "/images/30.png", alt: "AI Generated Image" },
]

const MarqueeColumn = ({
  start,
  end,
  reverse,
  className,
}: {
  start: number
  end: number
  reverse: boolean
  className?: string
}) => {
  return (
    <Marquee
      reverse={reverse}
      pauseOnHover
      vertical
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center",
        "[--duration:90s]",
        className,
      )}
    >
      {images.slice(start, end).map((image, index) => {
        return (
          <div
            key={index}
            className="relative transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <Image
              src={image.src}
              alt={image.alt}
              priority
              width={768}
              height={1024}
              className="object-cover opacity-25 transition-opacity duration-300 ease-in-out hover:opacity-100"
            />
          </div>
        )
      })}
    </Marquee>
  )
}

const Hero = (props: Props) => {
  return (
    <section className="border-b">
      <div className="container-wrapper relative">
        <div className="container pointer-events-none relative z-40 flex h-full min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <Link href="/login">
            <AnimatedGradientText className="pointer-events-auto">
              ✨ <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
              <span
                className={cn(
                  `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                )}
              >
                Introducing Pixora
              </span>
              <RiArrowRightSLine className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedGradientText>
          </Link>
          <h1 className="font-grotesk text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
            Transform your photos with the power of AI
          </h1>
          <p className="max-w-3xl text-sm text-neutral-800 md:text-base lg:text-lg">
            From LinkedIn headshots to Instagram influencer photos, Pixora's
            state-of-the-art technology ensures you always look your best.
            Create, edit and generate images effortlessly.
          </p>
          <div className="flex flex-col items-center gap-2 xs:flex-row">
            <div className="flex items-center -space-x-4 overflow-hidden">
              {avatars.map((avatar, index) => {
                return (
                  <Avatar
                    key={index}
                    className="inline-block border-2 border-background"
                  >
                    <AvatarImage
                      src={avatar.src}
                      className="h-full w-full object-cover"
                    />
                    <AvatarFallback>{avatar.fallback}</AvatarFallback>
                  </Avatar>
                )
              })}
            </div>
            <span className="text-sm">Loved by 100+ customers</span>
          </div>
          <Link href="/login" className="pointer-events-auto mt-2">
            <Button
              variant="default"
              size="lg"
              className="flex items-center hover:bg-primary/100"
            >
              <div>Get Started Now!</div>
            </Button>
          </Link>
        </div>
        <div className="absolute inset-0 z-10 hidden h-full w-full grid-cols-6 px-2 xl:grid">
          <MarqueeColumn reverse={false} start={0} end={5} />
          <MarqueeColumn reverse={true} start={5} end={10} />
          <MarqueeColumn reverse={false} start={10} end={15} />
          <MarqueeColumn reverse={true} start={15} end={20} />
          <MarqueeColumn reverse={false} start={20} end={25} />
          <MarqueeColumn reverse={true} start={25} end={30} />
        </div>
        <div className="absolute inset-0 z-10 hidden h-full w-full grid-cols-5 px-2 md:grid xl:hidden">
          <MarqueeColumn reverse={false} start={0} end={6} />
          <MarqueeColumn reverse={true} start={6} end={12} />
          <MarqueeColumn reverse={false} start={12} end={18} />
          <MarqueeColumn reverse={false} start={18} end={24} />
          <MarqueeColumn reverse={false} start={24} end={30} />
        </div>
        <div className="absolute inset-0 z-10 grid h-full w-full grid-cols-3 px-1 md:hidden">
          <MarqueeColumn
            reverse={false}
            start={0}
            end={10}
            className="p-1 [--gap:0.5rem]"
          />
          <MarqueeColumn
            reverse={true}
            start={10}
            end={20}
            className="p-1 [--gap:0.5rem]"
          />
          <MarqueeColumn
            reverse={false}
            start={20}
            end={30}
            className="p-1 [--gap:0.5rem]"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
