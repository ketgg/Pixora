import React from "react"

import { getUser } from "@/actions/auth"
import { redirect } from "next/navigation"
import { getUserTrainedModels } from "@/actions/model"
import { getUserBalance } from "@/actions/profile"

import StatCards from "./_components/stat-cards"
import RecentImages from "./_components/recent-images"
import { getImages } from "@/actions/storage"
import QuickActions from "./_components/quick-actions"
import RecentModels from "./_components/recent-models"

type Props = {}

const HomePage = async (props: Props) => {
  const user = await getUser()
  if (!user) redirect("/login")
  const { data: userModels } = await getUserTrainedModels()
  const { data: userImages } = await getImages()
  const { data: userCredits } = await getUserBalance()
  return (
    <main className="flex w-full flex-col space-y-6 px-4 pb-4 pt-1 md:px-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-freigeist text-2xl">
          Welcome back, {user.user_metadata.fullName}
        </h1>
        <h2 className="text-sm text-muted-foreground">
          Get a quick snapshot of your activity.
        </h2>
      </header>
      <div className="flex flex-col gap-4">
        <StatCards
          imagesCount={userImages?.length || 0}
          modelsCount={userModels?.length || 0}
          credits={userCredits}
        />
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <RecentImages images={userImages?.slice(0, 6) ?? []} />
          <div className="col-span-full flex w-full flex-col gap-4 sm:flex-row lg:col-span-1 lg:flex-col">
            <QuickActions />
            <RecentModels models={userModels?.slice(0, 2) || []} />
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage
