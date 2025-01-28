import Link from "next/link"
import React from "react"
import { RiCameraLensAiFill } from "@remixicon/react"

type Props = {}

const Logo = (props: Props) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <RiCameraLensAiFill size={32} />
      <span className="font-grotesk text-lg font-semibold">Pixora</span>
    </Link>
  )
}

export default Logo
