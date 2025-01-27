"use client"

import React, { useId } from "react"

import { PayPalButtons } from "@paypal/react-paypal-js"
import { OnApproveActions, OnApproveData } from "@paypal/paypal-js"

import { toast } from "sonner"

import { updateUserBalance } from "@/actions/profile"

import { PackType } from "@/types/pack"

type Props = {
  pack: PackType
}

const PayPalBtn = ({ pack }: Props) => {
  const { id: packId } = pack
  const createToastId = useId()
  const captureToastId = useId()
  const handleCreateOrder = async () => {
    try {
      toast.loading("Initiating PayPal Checkout...", { id: createToastId })
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: [{ id: packId }],
        }),
      })
      const orderData = await response.json()
      // console.log("@ORDER_DATA", orderData)
      if (orderData.id) {
        toast.success("PayPal Checkout initiated successfully.", {
          id: createToastId,
        })
        return orderData.id
      } else {
        const errorDetail = orderData?.details?.[0]
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData)

        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error(error)
      toast.error(`Could not initiate PayPal Checkout...${error}`, {
        id: createToastId,
      })
    }
  }

  const handleOnApprove = async (
    data: OnApproveData,
    actions: OnApproveActions,
  ) => {
    try {
      toast.loading("Handling capture...", { id: captureToastId })
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const orderData = await response.json()
      // console.log(
      //   "Capture result",
      //   orderData,
      //   JSON.stringify(orderData, null, 2),
      // )
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message
      const errorDetail = orderData?.details?.[0]
      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart()
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`)
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        const transaction = orderData.purchase_units[0].payments.captures[0]
        toast.success(`Transaction ${transaction.status}: ${transaction.id}.`, {
          id: captureToastId,
        })

        // Update user balance
        const {
          data: updateData,
          error: updateErr,
          success: updateSuccess,
        } = await updateUserBalance(packId)
        if (!updateSuccess || updateErr) {
          toast.error(
            "Something went wrong in updating your credits. Please contact the developer.",
          )
          throw new Error("Error updating user credits.")
        }
        toast.success("Your credits have been added successfully, Have fun!")
        // TODO - Create entry in purchases table + send purchase mail
      }
    } catch (error) {
      console.error(error)
      toast.error(`Sorry, your transaction could not be processed...${error}`, {
        id: captureToastId,
      })
    }
  }

  return (
    <div className="w-full">
      <PayPalButtons
        style={{
          shape: "pill",
          layout: "vertical",
          color: "gold",
        }}
        createOrder={handleCreateOrder}
        onApprove={async (data, error) => handleOnApprove(data, error)}
      />
    </div>
  )
}

export default PayPalBtn
