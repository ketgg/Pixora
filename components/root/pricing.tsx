import Image from "next/image"
import Link from "next/link"

import React from "react"
import { RiCheckLine } from "@remixicon/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { PACKS } from "@/constants/packs"

import { cn } from "@/lib/utils"

import { AnimatedGradientText } from "../ui/animated-gradient-text"

type Props = {}

const Pricing = (props: Props) => {
  return (
    <section id="pricing" className="border-b">
      <div className="container-wrapper bg-muted">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-24">
          <div className="flex flex-col items-center justify-center gap-4">
            <AnimatedGradientText className="pointer-events-auto">
              <span
                className={cn(
                  `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                )}
              >
                Pricing
              </span>
            </AnimatedGradientText>
            <h2 className="font-grotesk px-0 text-center text-3xl font-bold md:px-6 md:text-4xl lg:px-0">
              Choose a pack that fits your need
            </h2>
            <p className="px-0 text-base text-muted-foreground md:px-6 lg:max-w-[75%]">
              We offer a credit based system, refer to{" "}
              <Link
                href="/billing"
                className="underline underline-offset-2 hover:decoration-4 hover:underline-offset-4"
              >
                billing
              </Link>{" "}
              page for more details on how credits work.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
            {PACKS.map((pack) => {
              return (
                <Card
                  key={pack.id}
                  className="flex w-72 flex-col justify-between rounded-lg py-1 shadow-sm" // Added "flex flex-col" here
                >
                  <div>
                    <CardHeader className="flex flex-col gap-1">
                      <CardTitle className="font-grotesk flex justify-between text-xl font-light">
                        {pack.name}
                        {pack.discount && (
                          <Badge
                            variant="secondary"
                            className="font-sans text-sm"
                          >{`Save ${pack.discount}$`}</Badge>
                        )}
                      </CardTitle>
                      <div className="font-grotesk flex items-end gap-1">
                        <h2 className="text-3xl">${pack.price}</h2>

                        <span className="flex pb-0.5">{`/ ${pack.credits} credits`}</span>
                      </div>
                      <CardDescription>{pack.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      {pack.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex gap-2 text-sm text-foreground"
                        >
                          <RiCheckLine size={18} className="shrink-0" />
                          <p className="text-sm">{feature}</p>
                        </div>
                      ))}
                    </CardContent>
                  </div>

                  <CardFooter className="">
                    <Button>
                      <Link href="/billing">{`Get ${pack.name} Pack`}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
