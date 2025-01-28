import React from "react"
import TrainModelForm from "./_components/train-model-form"

type Props = {}

const TrainModelPage = (props: Props) => {
  return (
    <main className="flex w-full flex-col space-y-6 px-4 pt-1 md:px-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-grotesk text-2xl">Train Model</h1>
        <h2 className="text-sm text-muted-foreground">
          Train a new model with your own images.
        </h2>
      </header>
      <div className="max-w-3xl">
        <TrainModelForm />
      </div>
    </main>
  )
}

export default TrainModelPage
