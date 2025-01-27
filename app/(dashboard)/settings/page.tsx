import { redirect } from "next/navigation"
import React from "react"

import { getUser } from "@/actions/auth"

import AccountForm from "./_components/account-form"
import SecuritySettings from "./_components/security-settings"

type Props = {}

const SettingsPage = async (props: Props) => {
  const user = await getUser()
  if (!user) redirect("/login")

  return (
    <main className="flex w-full flex-col space-y-6 px-4 pb-4 pt-1 md:px-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-freigeist text-2xl">Account Settings</h1>
        <h2 className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </h2>
        <div></div>
      </header>
      <AccountForm user={user} />
      <SecuritySettings user={user} />
    </main>
  )
}

export default SettingsPage
