import React from "react"

import InputParams from "./_components/input-params"

type Props = {}

const GenerateImagePage = (props: Props) => {
  return (
    <main className="grid w-full grid-rows-2 divide-y divide-border md:grid-cols-2 md:grid-rows-1 md:divide-x md:divide-y-0">
      <section className="flex flex-col space-y-6 px-6 py-1">
        <h1 className="font-freigeist text-2xl">Input</h1>
        <InputParams />
      </section>
      <section className="px-6 py-6 md:py-1">
        <h1 className="font-freigeist text-2xl">Output</h1>
      </section>
    </main>
  )
}

export default GenerateImagePage
