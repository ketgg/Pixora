"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/actions/auth"

type Props = {}

const SignOutBtn = (props: Props) => {
  const handleOnClick = async () => {
    await signOut()
  }

  return (
    <Button variant="destructive" onClick={handleOnClick}>
      Sign Out
    </Button>
  )
}

export default SignOutBtn
