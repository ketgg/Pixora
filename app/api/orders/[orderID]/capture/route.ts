import { NextRequest, NextResponse } from "next/server"

import {
  ApiError,
  CheckoutPaymentIntent,
  OrderRequest,
} from "@paypal/paypal-server-sdk"

import { PACKS } from "@/constants/packs"
import { ordersController } from "@/lib/paypal/client"
import { stat } from "fs"

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID: string) => {
  const collect = {
    id: orderID,
    prefer: "return=minimal",
  }

  try {
    const { body, ...httpResponse } =
      await ordersController.ordersCapture(collect)
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body as string),
      httpStatusCode: httpResponse.statusCode,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      throw new Error(error.message)
    }
  }
}

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ orderID: string }> },
) => {
  try {
    const orderID = (await params).orderID
    const response = await captureOrder(orderID)
    if (!response?.jsonResponse || !response?.httpStatusCode) {
      throw new Error("Invalid response.")
    }
    const { jsonResponse, httpStatusCode } = response
    return NextResponse.json(jsonResponse, { status: httpStatusCode })
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json(
      { error: "Failed to capture order." },
      { status: 500 },
    )
  }
}
