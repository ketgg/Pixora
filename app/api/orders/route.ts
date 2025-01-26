import { NextRequest, NextResponse } from "next/server"

import {
  ApiError,
  CheckoutPaymentIntent,
  OrderRequest,
} from "@paypal/paypal-server-sdk"

import { PACKS } from "@/constants/packs"
import { ordersController } from "@/lib/paypal/client"

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart: { id: string }[]) => {
  if (cart.length === 0) {
    return {
      jsonResponse: { error: "Cart is empty." },
      httpStatusCode: 401,
    }
  }
  const selectedPack = PACKS.find((pack) => pack.id === cart[0].id)
  const collect = {
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: "USD",
            value: selectedPack?.price.toFixed(2),
          },
        },
      ],
    } as OrderRequest,
    prefer: "return=minimal",
  }

  try {
    const { body, ...httpResponse } =
      await ordersController.ordersCreate(collect)
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body as string),
      httpStatusCode: httpResponse.statusCode,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      const { statusCode } = error
      return {
        jsonResponse: error.message,
        httpStatusCode: statusCode,
      }
    } else {
      return {
        jsonResponse:
          error instanceof Error
            ? error.message
            : "Something went wront while creating order.",
        httpStatusCode: 500,
      }
    }
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    // console.log("@ORDER_BODY", body)
    const { cart } = body
    const { jsonResponse, httpStatusCode } = await createOrder(cart)
    return NextResponse.json(jsonResponse, { status: httpStatusCode })
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 },
    )
  }
}
