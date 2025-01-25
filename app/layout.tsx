import type { Metadata } from "next"
import localFont from "next/font/local"
import { Geist, Geist_Mono } from "next/font/google"

import NextTopLoader from "nextjs-toploader"

import "@/styles/globals.css"

import { Toaster } from "@/components/ui/sonner"

import {
  RiLoader4Line,
  RiCheckLine,
  RiErrorWarningFill,
  RiInformation2Fill,
} from "@remixicon/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const neueFreigeist = localFont({
  src: [
    {
      path: "../assets/fonts/NeueFreigeist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/NeueFreigeist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/NeueFreigeist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/NeueFreigeist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-neue-freigeist",
})

const basierSquare = localFont({
  src: [
    {
      path: "../assets/fonts/BasierSquare-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/BasierSquare-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/BasierSquare-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/BasierSquare-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-basier-square",
})

const jetBrainsMono = localFont({
  src: [
    {
      path: "../assets/fonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${neueFreigeist.variable} ${basierSquare.variable} ${jetBrainsMono.variable} mx-auto min-w-80 max-w-[120rem] font-sans antialiased`}
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
            className: "rounded-none font-freigeist",
          }}
        />
      </body>
    </html>
  )
}
