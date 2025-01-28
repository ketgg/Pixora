"use client"

import React, { useId } from "react"
import { User } from "@supabase/supabase-js"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

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

const formSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
})

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { updateProfile } from "@/actions/settings"

type Props = {
  user: User
}

const AccountForm = ({ user }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user.user_metadata?.fullName || "",
      email: user?.email || "",
    },
  })

  const toastId = useId()
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Updating profile...", { id: toastId })
    try {
      const { error, success } = await updateProfile(values)
      if (!success) {
        toast.error(error, { id: toastId })
      } else {
        toast.success("Profile updated successfully", { id: toastId })
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong in updating the profile.",
        { id: toastId },
      )
    }
  }
  return (
    <Card className="max-w-4xl rounded-lg shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="font-grotesk text-lg font-normal">
          Profile
        </CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={true}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your email address is used for Sign In and Notifications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="">
              Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default AccountForm
