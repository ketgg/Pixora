"use client"

import { usePathname } from "next/navigation"
import React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Props = {}

export const AppBreadcrumb = (props: Props) => {
  const pathname = usePathname()
  const pathSegments = pathname.split("/")
  // console.log(pathSegments) // [ '', 'home' ] or [ '', 'billing'] ...
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={`/home`} className="capitalize">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            {pathSegments[1]}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
