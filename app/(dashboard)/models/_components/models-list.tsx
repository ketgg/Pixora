"use client"

import Link from "next/link"
import React, { useState } from "react"
import { Masonry } from "react-plock"
import { formatDistance, set } from "date-fns"
import { RiDeleteBin6Line, RiTimeLine } from "@remixicon/react"

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

type Props = {
  modelsData: {
    error: string | null
    success: boolean
    data: Database["public"]["Tables"]["Models"]["Row"][] | null
  }
}

const statusColor = {
  FAILED: "text-failed bg-failed-alt border-failed-border",
  SUCCEEDED: "text-succeeded bg-succeeded-alt border-succeeded-border",
  PROCESSING: "text-processing bg-processing-alt border-processing-border",
  CANCELED: "text-canceled bg-canceled-alt border-canceled-border",
  STARTING: "text-muted-foreground",
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
          <Link href="/train-model">
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
          gap: [16, 12, 8, 8],
          media: [640, 1024, 1280, 1440],
        }}
        render={(model) => {
          const status = model.trainingStatus
          return (
            <Card className="w-full rounded-lg shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="font-freigeisttext-xl flex items-center justify-between">
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
                <CardDescription>
                  Created{" "}
                  {formatDistance(new Date(model.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="gap flex flex-col gap-0.5 bg-muted px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <RiTimeLine size={16} />
                    <span>Training Duration</span>
                  </div>
                  <p className="font-mono text-sm">
                    {Math.round(Number(model.trainingTime)) / 60 || NaN} mins
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        }}
      />
    </section>
  )
}

export default ModelsList
