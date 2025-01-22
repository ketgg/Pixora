import Link from "next/link"
import React from "react"
import { RiSparklingLine } from "@remixicon/react"

type Props = {}

const Logo = (props: Props) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <RiSparklingLine size={32} strokeWidth={1.5} />
      <span className="font-freigeist text-lg font-semibold">Pixora</span>
    </Link>
  )
}

export default Logo
