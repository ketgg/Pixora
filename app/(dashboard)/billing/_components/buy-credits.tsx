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
import PayPalBtn from "./paypal-btn"
type Props = {}

const BuyCredits = (props: Props) => {
  return (
    <section className="flex w-full flex-col space-y-4">
      <h2 className="font-grotesk text-lg font-semibold">Available Packs</h2>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
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
                {/* <Button>{`Get ${pack.name} Pack`}</Button> */}
                <PayPalBtn pack={pack} />
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export default BuyCredits
