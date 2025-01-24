import React from "react"
import Gallery from "./_components/gallery"

import { getImages } from "@/actions/storage"

type Props = {}

const GalleryPage = async (props: Props) => {
  const { data: images } = await getImages()
  return (
    <main className="flex w-full flex-col space-y-6 px-4 py-1 md:px-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-freigeist text-2xl">My Images</h1>
        <h2 className="text-sm text-muted-foreground">
          View and manage your generated images.
        </h2>
      </header>
      <Gallery images={images || []} />
    </main>
  )
}

export default GalleryPage
