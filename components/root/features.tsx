import React from "react"
import { RiImageAiLine, RiBox3Line, RiBrushAiLine } from "@remixicon/react"
import Image from "next/image"

import { cn } from "@/lib/utils"

import { AnimatedGradientText } from "../ui/animated-gradient-text"

const features = [
  {
    title: "AI-Powered Photos",
    description:
      "Instantly transform your photos into high-quality, lifelike images with the power of AI. Whether you need fresh content for social media, professional shots for LinkedIn, or a fun set of images for personal project.",
    icon: <RiImageAiLine size={24} />,
  },
  {
    title: "Diverse Photo Packs at Your Fingertips",
    description:
      "Diverse Photo Packs at Your Fingertips Instantly transform your photos into high-quality, lifelike images with the power of AI. Whether you need fresh content for social media, professional shots for LinkedIn, or a fun set of images for personal project.",
    icon: <RiBox3Line size={24} />,
  },
  {
    title: "Customizable Photo Generation",
    description:
      "Customizable Photo Generation Instantly transform your photos into high-quality, lifelike images with the power of AI. Whether you need fresh content for social media, professional shots for LinkedIn, or a fun set of images for personal project.",
    icon: <RiBrushAiLine size={24} />,
  },
]

const Features = () => {
  return (
    <section id="features" className="border-b">
      <div className="container-wrapper bg-muted">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-24">
          <div className="flex flex-col items-center justify-center gap-4">
            <AnimatedGradientText className="pointer-events-auto">
              <span
                className={cn(
                  `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                )}
              >
                Features
              </span>
            </AnimatedGradientText>
            <h2 className="font-grotesk px-0 text-center text-3xl font-bold md:px-6 md:text-4xl lg:px-0">
              Unlock Unlimited Possibilities with Pixora
            </h2>
            <p className="px-0 text-base text-muted-foreground md:px-6 lg:max-w-[75%]">
              Our platform offers a wide range of features designed to enhance
              your image creation experience. From easy-to-use editing tools to
              powerful AI-powered image generation, we have everything you need
              to bring your ideas to life.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Features */}
            <div className="order-2 flex flex-col items-start justify-start gap-8 px-0 py-10 sm:gap-12 sm:py-12 md:gap-16 md:p-12 lg:order-1">
              {features.map((feature) => {
                return (
                  <div key={feature.title} className="flex items-start gap-4">
                    <span className="p-2 md:bg-foreground md:text-background">
                      {feature.icon}
                    </span>
                    <div>
                      <h4 className="text-lg font-medium sm:text-xl">
                        {feature.title}
                      </h4>
                      <p className="pt-2 text-sm text-muted-foreground sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Dashboard Image */}
            <div className="order-1 h-fit w-full p-0 md:p-6 lg:p-0">
              <div
                className={cn(
                  "border p-4 xs:p-8 md:p-12 lg:sticky lg:top-24 lg:order-2 lg:pb-0 lg:pl-12 lg:pr-0 lg:pt-12",
                  "animate-gradient bg-gradient-to-r from-[#627FAB] via-[#B95480] to-[#627FAB] bg-[length:var(--bg-size)_100%] [--bg-size:400%]",
                )}
              >
                <Image
                  src="/images/dashboard.png"
                  alt="Dashboard Image"
                  width={875}
                  height={875}
                  className="aspect-square"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
