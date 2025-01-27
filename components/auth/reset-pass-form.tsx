"use client"

import React, { useId } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { resetPassword } from "@/actions/settings"

const formSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email address!",
  }),
})

type Props = {}

const ResetPasswordForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })
  const toastId = useId()
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Sending reset password email...", { id: toastId })
    try {
      const { success, error } = await resetPassword({
        email: values.email || "",
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
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Reset Password</Button>
      </form>
    </Form>
  )
}

export default ResetPasswordForm
