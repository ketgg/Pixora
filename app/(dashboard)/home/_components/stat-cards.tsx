import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  RiBox3Line,
  RiImage2Line,
  RiMoneyDollarCircleLine,
} from "@remixicon/react"

type Props = {
  imagesCount: number
  modelsCount: number
  credits: number
}

const StatCards = ({ imagesCount, modelsCount, credits }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <Card className="rounded-lg shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          <RiImage2Line size={18} />
        </CardHeader>
        <CardContent>
          <div className="font-grotesk text-2xl font-bold">{imagesCount}</div>
          <p className="text-xs text-muted-foreground">
            Images generated so far
          </p>
        </CardContent>
      </Card>
      <Card className="rounded-lg shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Models</CardTitle>
          <RiBox3Line size={18} />
        </CardHeader>
        <CardContent>
          <div className="font-grotesk text-2xl font-bold">{modelsCount}</div>
          <p className="text-xs text-muted-foreground">
            Custom models trained so far
          </p>
        </CardContent>
      </Card>
      <Card className="rounded-lg shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Credits</CardTitle>
          <RiMoneyDollarCircleLine size={18} />
        </CardHeader>
        <CardContent>
          <div className="font-grotesk text-2xl font-bold">{credits}</div>
          <p className="text-xs text-muted-foreground">Available credits</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatCards
