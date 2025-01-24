import React from "react"

import ModelsList from "./_components/models-list"

import { getUserTrainedModels } from "@/actions/model"

type Props = {}

const Models = async (props: Props) => {
  const userModels = await getUserTrainedModels()
  return (
    <main className="flex w-full flex-col space-y-6 px-4 pt-1 md:px-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-freigeist text-2xl">My Models</h1>
        <h2 className="text-sm text-muted-foreground">
          View and manage your trained models.
        </h2>
      </header>
      <ModelsList modelsData={userModels} />
    </main>
  )
}

export default Models
