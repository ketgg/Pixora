import * as React from "react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { NavLogo } from "./nav-logo"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"

import { getUserBalance } from "@/actions/profile"

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  const user = {
    fullName: data.user?.user_metadata.fullName,
    email: data.user?.email || "",
  }

  const { data: userCredits } = await getUserBalance()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain userCredits={userCredits} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser name={user.fullName} email={user.email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
