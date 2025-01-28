import type { Metadata } from "next"
import localFont from "next/font/local"
import NextTopLoader from "nextjs-toploader"

import "@/styles/globals.css"

import { Toaster } from "@/components/ui/sonner"

import PayPalProvider from "@/components/providers/paypal"

import {
  RiLoader4Line,
  RiCheckLine,
  RiErrorWarningFill,
  RiInformation2Fill,
} from "@remixicon/react"

const jetBrainsMono = localFont({
  src: [
    {
      path: "../assets/fonts/JetBrains/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
})

const agrandirNormal = localFont({
  src: "../assets/fonts/Agrandir/PPAgrandirNormal-Variable.ttf",
  variable: "--font-agrandir-normal",
})
const agrandirNarrow = localFont({
  src: "../assets/fonts/Agrandir/PPAgrandirNarrow-Variable.ttf",
  variable: "--font-agrandir-narrow",
})
const agrandirText = localFont({
  src: "../assets/fonts/Agrandir/PPAgrandirText-Variable.ttf",
  variable: "--font-agrandir-text",
})

const mori = localFont({
  src: "../assets/fonts/Mori/PPMori-VariableVF.woff2",
  variable: "--font-mori",
})

export const metadata: Metadata = {
  title: "Pixora",
  description:
    "Generate AI powered images, train model on your images and much more!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="">
      <PayPalProvider>
        <body
          className={`${mori.variable} ${agrandirText.variable} ${agrandirNarrow.variable} ${agrandirNormal.variable} ${jetBrainsMono.variable} mx-auto min-w-80 font-sans antialiased`}
        >
          <NextTopLoader
            color="#101010"
            initialPosition={0.08}
            crawlSpeed={200}
            height={2}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow={false}
          />
          {children}
          <Toaster
            theme="light"
            icons={{
              success: <RiCheckLine />,
              error: <RiErrorWarningFill />,
              info: <RiInformation2Fill />,
              loading: <RiLoader4Line className="animate-spin" />,
            }}
            toastOptions={{
              className: "rounded-none font-grotesk",
            }}
          />
        </body>
      </PayPalProvider>
    </html>
  )
}
