"use client"

import { PayPalScriptProvider } from "@paypal/react-paypal-js"

import React from "react"

type Props = {
  children: React.ReactNode
}
const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIEND_ID! as string,
  currency: "USD",
  components: "buttons",
}

const PayPalProvider = ({ children }: Props) => {
  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  )
}

export default PayPalProvider
