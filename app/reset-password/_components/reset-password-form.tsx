"use client"

import { useRouter } from "next/navigation"

import React, { useId, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { RiLoader4Line } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { updatePassword } from "@/actions/auth"

const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(passwordRegex, {
        message:
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
      }),
    confirmPassword: z.string({
      required_error: "Confirm password is required!",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password's don't match!",
    path: ["confirmPassword"],
  })

type Props = {}

const ResetPasswordForm = (props: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const toastId = useId()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast.loading("Updating password...", { id: toastId })
      setLoading(true)

      const { success, error } = await updatePassword(values.password)
      if (!success) {
        toast.error(String(error), { id: toastId })
      } else {
        toast.success("Password updated successfully!", {
          id: toastId,
        })

        router.push("/login")
      }
    } catch (error) {
      toast.error(String(error), { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col space-y-1 text-center">
        <h1 className="font-freigeist text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">Update your password</p>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter a strong password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Re-enter your new password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading && (
              <RiLoader4Line size={16} className="mr-2 animate-spin" />
            )}
            {loading ? "Updating password..." : "Update password"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ResetPasswordForm
