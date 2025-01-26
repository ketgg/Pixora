"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  RemixiconComponentType,
  RiBankCardLine,
  RiFoldersLine,
  RiFolderZipLine,
  RiGalleryFill,
  RiGalleryLine,
  RiHome4Line,
  RiHome5Fill,
  RiHome5Line,
  RiImageAiFill,
  RiImageAiLine,
  RiStackFill,
  RiStackLine,
  RiUserSettingsFill,
  RiUserSettingsLine,
  RiArrowRightSLine,
  RiBox3Line,
  RiCoinsLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

import { getUserBalance } from "@/actions/balance"

import { cn } from "@/lib/utils"

type ItemType = {
  title: string
  url: string
  icon?: RemixiconComponentType
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

const items: ItemType[] = [
  {
    title: "Home",
    url: "/home",
    icon: RiHome5Line,
    items: [],
    isActive: true,
  },
  {
    title: "Generate Image",
    url: "/generate",
    icon: RiImageAiLine,
    items: [],
  },
  {
    title: "My Images",
    url: "/gallery",
    icon: RiGalleryLine,
    items: [],
  },
  {
    title: "Train Model",
    url: "/train",
    icon: RiBox3Line,
    items: [],
  },
  {
    title: "My Models",
    url: "/models",
    icon: RiFolderZipLine,
    items: [],
  },
  {
    title: "Billing",
    url: "/billing",
    icon: RiBankCardLine,
    items: [],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: RiUserSettingsLine,
    items: [],
  },
]

type Props = {
  userCredits: number
}

export function NavMain({ userCredits }: Props) {
  const path = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <RiArrowRightSLine className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          } else {
            const isActive = item.url === path
            const isBilling = item.url === "/billing"
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton className="" tooltip={item.title} asChild>
                  <Link
                    href={item.url}
                    className={cn(isActive && "text-foreground")}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>

                    {/* {isBilling && (
                      <Badge
                        variant="outline"
                        className="flex gap-1 rounded-full px-2"
                      >
                        <RiMoneyDollarCircleLine size={16} />
                        {userCredits}
                      </Badge>
                    )} */}
                  </Link>
                  {/* // {item.icon && <item.icon />}
                  // <span>{item.title}</span> */}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
