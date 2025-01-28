"use client"

import React, { useId } from "react"
import { User } from "@supabase/supabase-js"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { resetPassword, updateProfile } from "@/actions/settings"

type Props = {
  user: User
}

const SecuritySettings = ({ user }: Props) => {
  const toastId = useId()
  const handleResetPassword = async () => {
    toast.loading("Sending reset password email...", { id: toastId })
    try {
      const { success, error } = await resetPassword({
        email: user.email || "",
      })
      if (!success) {
        toast.error(error, { id: toastId })
      } else {
        toast.success(
          "Password reset email sent successfully! Please check your email for further intructions.",
          { id: toastId },
        )
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending the reset password link.",
        { id: toastId },
      )
    }
  }
  return (
    <Card className="max-w-4xl rounded-lg shadow-none">
      <CardHeader className="">
        <CardTitle className="font-grotesk text-lg font-normal">
          Security
        </CardTitle>
        <CardDescription>Change your password</CardDescription>
      </CardHeader>
      <CardContent className="">
        <Button onClick={handleResetPassword}>Change Password</Button>
      </CardContent>
    </Card>
  )
}

export default SecuritySettings
