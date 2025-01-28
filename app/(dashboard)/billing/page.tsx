import React from "react"
import Balance from "./_components/balance"
import BuyCredits from "./_components/buy-credits"

type Props = {}

const BillingPage = (props: Props) => {
  return (
    <main className="flex w-full flex-col space-y-6 px-4 pb-4 pt-1 md:px-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-grotesk text-2xl">Pricing & Billing</h1>
        <h2 className="text-sm text-muted-foreground">
          Manage and buy credits.
        </h2>
        <div></div>
      </header>
      <Balance />
      <section className="">
        <h3 className="font-grotesk text-lg">How credits work?</h3>
        <div className="mt-2 text-sm text-muted-foreground">
          <ul className="list-disc pl-6">
            <li>
              Purchase Credits: We offer 10 free credits for new users. You can
              buy credits from one of our packs (see below).
            </li>
            <li>
              Use Credits: Spend credits to generate images or train custom
              models.
            </li>
            <li>
              Track Usage: Monitor your credit balance and usage in your account
              dashboard.
            </li>
          </ul>
        </div>
      </section>

      <section className="">
        <h3 className="font-grotesk text-lg">Credit costs for services</h3>
        <p className="mt-2 text-sm">Here's how many credits each task costs:</p>
        <div className="mt-2 text-sm text-muted-foreground">
          {/* Image Generation Costs */}
          <div className="mb-4">
            <h4 className="font-medium">Image Generation</h4>
            <ul className="list-disc pl-6">
              <li>Flux Schnell Model: 2 credits per image</li>
              <li>Flux Dev Model: 10 credits per image</li>
              <li>Custom Model: 10 credits per image</li>
            </ul>
          </div>

          {/* Training Costs */}
          <div>
            <h4 className="font-medium">Model Training</h4>
            <ul className="list-disc pl-6">
              <li>Custom Model Training: 20 credits per minute</li>
              <li>Average training time: 20-25 minutes (400-500 credits)</li>
            </ul>
          </div>
        </div>
      </section>

      <BuyCredits />
    </main>
  )
}

export default BillingPage
