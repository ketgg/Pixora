"use client"

import Link from "next/link"
import React, { useState } from "react"
import { Masonry } from "react-plock"
import { formatDistance, set } from "date-fns"
import {
  RiArrowRightFill,
  RiArrowRightLine,
  RiDeleteBin6Line,
  RiTimeLine,
} from "@remixicon/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Database } from "@/types/database"

import { cn } from "@/lib/utils"

import DeleteModelDialog from "./delete-dialog"

import { statusColor } from "@/constants/status"

type Props = {
  modelsData: {
    error: string | null
    success: boolean
    data: Database["public"]["Tables"]["Models"]["Row"][] | null
  }
}

const ModelsList = ({ modelsData }: Props) => {
  const { data: models, success, error } = modelsData
  const [loading, setLoading] = useState<boolean>(false)

  if (models?.length === 0) {
    return (
      <Card className="mx-auto flex max-w-2xl flex-col rounded-lg shadow-none">
        <CardHeader>
          <CardTitle className="font-freigeist text-lg">
            No models found
          </CardTitle>
          <CardDescription>
            You have not trained any models yet. Click below to create and train
            a new model.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/train">
            <Button className="shadow-none">Create Model</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <section className="">
      <Masonry
        items={models || []}
        config={{
          columns: [1, 2, 3, 4],
          gap: [16, 16, 16, 16],
          media: [640, 1024, 1280, 1440],
        }}
        render={(model) => {
          const status = model.trainingStatus
          const trainingTimeInMins =
            Math.round(Number(model.trainingTime)) / 60 || NaN
          const formattedTime = !isNaN(trainingTimeInMins)
            ? trainingTimeInMins.toFixed(2)
            : "NaN"
          return (
            <Card className="flex w-full flex-col gap-4 rounded-lg p-4 shadow-none">
              <CardHeader className="flex flex-col gap-0 space-y-0 p-0">
                <CardTitle className="flex items-center justify-between font-freigeist text-xl">
                  {model.modelName}
                  <div className="flex items-center gap-2">
                    {status && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-sans capitalize",
                          statusColor[status],
                        )}
                      >
                        {status === "PROCESSING"
                          ? "training"
                          : status.toLowerCase()}
                      </Badge>
                    )}
                    <DeleteModelDialog
                      id={model.id}
                      modelId={model.modelId || ""}
                      modelVersion={model.VERSION || ""}
                      loading={loading}
                      setLoading={setLoading}
                    >
                      <Button
                        disabled={loading}
                        variant="ghost"
                        size="icon"
                        className="flex items-center gap-2"
                      >
                        <RiDeleteBin6Line className="text-destructive" />
                      </Button>
                    </DeleteModelDialog>
                  </div>
                </CardTitle>
                <CardDescription className="text-sm">
                  Created{" "}
                  {formatDistance(new Date(model.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="gap flex flex-col gap-1.5 bg-muted px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <RiTimeLine size={16} />
                    <span className="font-mono text-xs">Training Duration</span>
                  </div>
                  <p className="font-mono text-sm">{formattedTime} mins</p>
                </div>
              </CardContent>
              <CardFooter className="p-0">
                <Link
                  href={
                    status === "SUCCEEDED"
                      ? `/generate?model-id=${model.modelId}:${model.VERSION}`
                      : "#"
                  }
                  className={cn(
                    "group inline-flex w-full",
                    status !== "SUCCEEDED" && "pointer-events-none opacity-75",
                  )}
                >
                  <Button
                    disabled={status !== "SUCCEEDED"}
                    className={cn(
                      "w-full group-hover:bg-primary/90",
                      status !== "SUCCEEDED" && "cursor-not-allowed",
                    )}
                  >
                    Generate Images <RiArrowRightLine />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        }}
      />
    </section>
  )
}

export default ModelsList
