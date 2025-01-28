import React from "react"

import Link from "next/link"

import { RiMenuLine } from "@remixicon/react"

import Logo from "./logo"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet"

const NavItems = () => {
  return (
    <>
      <Link
        href="#features"
        className="text-sm font-medium underline-offset-4 hover:underline"
      >
        Features
      </Link>
      <Link
        href="#pricing"
        className="text-sm font-medium underline-offset-4 hover:underline"
      >
        Pricing
      </Link>
      <Link
        href="#faqs"
        className="text-sm font-medium underline-offset-4 hover:underline"
      >
        FAQs
      </Link>
      <Button>
        <Link href="/login">Sign In</Link>
      </Button>
    </>
  )
}

const Navigation = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center justify-center gap-6 md:flex">
            <NavItems />
          </nav>
          <div className="overflow-hidden md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <RiMenuLine size={20} />
              </SheetTrigger>
              <SheetContent>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <nav className="mt-12 flex flex-col gap-4">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navigation
