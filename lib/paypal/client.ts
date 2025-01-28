import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
} from "@paypal/paypal-server-sdk"

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIEND_ID!
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY!

export const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_SECRET_KEY,
  },
  timeout: 0,
  environment: Environment.Production,
  // logging: {
  //   logLevel: LogLevel.Info,
  //   logRequest: { logBody: true },
  //   logResponse: { logHeaders: true },
  // },
})

export const ordersController = new OrdersController(client)
export const paymentsController = new PaymentsController(client)
