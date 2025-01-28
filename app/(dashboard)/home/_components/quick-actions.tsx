import Link from "next/link"

import React from "react"
import { RiMagicLine, RiBankCardLine, RiBox3Line } from "@remixicon/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

type Props = {}

const QuickActions = (props: Props) => {
  return (
    <Card className="flex-1 rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className={cn("font-medium")}>Quick Actions</CardTitle>
        <CardDescription>Get started with common actions</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button asChild className="w-full">
          <Link href="/generate">
            <RiMagicLine size={16} /> Generate Image
          </Link>
        </Button>
        <Button asChild className="w-full" variant="destructive">
          <Link href="/train">
            <RiBox3Line size={16} /> Train Model
          </Link>
        </Button>
        <Button asChild className="w-full" variant="secondary">
          <Link href="/billing">
            <RiBankCardLine size={16} /> Biling
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default QuickActions
