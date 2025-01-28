import * as React from "react"
import { RiCameraLensAiFill } from "@remixicon/react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export const NavData = {
  name: "Pixora",
  logo: RiCameraLensAiFill,
  plan: "Beta",
}

export function NavLogo({
  data = NavData,
}: {
  data?: {
    name: string
    logo: React.ElementType
    plan: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
            <data.logo className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="font-grotesk truncate font-bold">{data.name}</span>
            <span className="truncate text-xs">{data.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
