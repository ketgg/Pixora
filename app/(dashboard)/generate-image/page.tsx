import React from "react"

import InputParams from "./_components/input-params"
import OutputImages from "./_components/output-images"

type Props = {}

const GenerateImagePage = (props: Props) => {
  return (
    <main className="grid w-full grid-rows-2 divide-y divide-border md:grid-cols-2 md:grid-rows-1 md:divide-x md:divide-y-0">
      <section className="flex flex-col space-y-6 px-4 py-1 md:px-6">
        <h1 className="font-freigeist text-2xl">Input</h1>
        <InputParams />
      </section>
      <section className="flex flex-col space-y-8 px-4 py-6 md:px-6 md:py-1">
        <h1 className="font-freigeist text-2xl">Output</h1>
        <OutputImages />
      </section>
    </main>
  )
}

export default GenerateImagePage
