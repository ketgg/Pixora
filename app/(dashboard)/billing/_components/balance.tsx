import React from "react"
import { Badge } from "@/components/ui/badge"
import { RiMoneyDollarCircleLine } from "@remixicon/react"
import { getUserBalance } from "@/actions/profile"

type Props = {}

const Balance = async (props: Props) => {
  const { error, success, data: userCredits } = await getUserBalance()
  if (error || !success) {
    return (
      <div className="font-mono text-sm text-destructive">
        ERROR: Something went wrong, Please contact the developer.
      </div>
    )
  }
  return (
    <section className="font-grotesk flex items-center gap-2 text-base">
      <span className="">Your Credits</span>
      <Badge
        variant="secondary"
        className="flex flex-row items-center gap-0.5 rounded-full font-mono text-sm font-light"
      >
        <RiMoneyDollarCircleLine size={16} />
        <span>{userCredits ?? "-"}</span>
      </Badge>
    </section>
  )
}

export default Balance
