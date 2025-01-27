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

import { Badge } from "@/components/ui/badge"

import { Database } from "@/types/database"

import { statusColor } from "@/constants/status"

import { cn } from "@/lib/utils"

type Props = {
  models: Database["public"]["Tables"]["Models"]["Row"][]
}

const RecentModels = ({ models }: Props) => {
  return (
    <Card className="flex-1 rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Recent Models</CardTitle>
        {/* <CardDescription>Your recently trained models</CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 font-freigeist">
          {models.length === 0 ? (
            <p>No models trained yet.</p>
          ) : (
            models.map((model) => {
              return (
                <div
                  key={model.id}
                  className="flex items-center justify-between"
                >
                  <p>{model.modelName}</p>
                  {model.trainingStatus && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-sans capitalize",
                        statusColor[model.trainingStatus],
                      )}
                    >
                      {model.trainingStatus === "PROCESSING"
                        ? "training"
                        : model.trainingStatus.toLowerCase()}
                    </Badge>
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentModels
