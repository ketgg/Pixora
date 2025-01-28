import Link from "next/link"
import React from "react"
import { RiCameraLensAiFill } from "@remixicon/react"

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <RiCameraLensAiFill size={32} />
      <span className="font-grotesk text-lg font-semibold">Pixora</span>
    </Link>
  )
}

export default Logo
