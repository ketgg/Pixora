"use client"

import { redirect } from "next/navigation"

import React, { useId, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { RiLoader4Line } from "@remixicon/react"

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

import { signIn } from "@/actions/auth"

const formSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email address!",
  }),
  password: z.string().min(8, {
    message: "Password must be atleast 8 characters long.",
  }),
})

type Props = {}

const SignInForm = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const toastId = useId()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Signing in...", { id: toastId })
    setLoading(true)

    const formData = new FormData()
    formData.append("email", values.email)
    formData.append("password", values.password)

    const { data, success, error } = await signIn(formData)
    if (!success) {
      toast.error("Failed to Sign In", { id: toastId })
      setLoading(false)
    } else {
      toast.success("Signed in successfully!", {
        id: toastId,
      })
      setLoading(false)
      redirect("/dashboard")
    }
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
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading && <RiLoader4Line size={16} className="mr-2 animate-spin" />}
          Sign In
        </Button>
      </form>
    </Form>
  )
}

export default SignInForm
