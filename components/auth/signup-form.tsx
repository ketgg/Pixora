"use client"

import { redirect } from "next/navigation"

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { signUp } from "@/actions/auth"

const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

const formSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Name must be at least 2 characters long.",
    }),
    email: z.string().email({
      message: "Enter a valid email address!",
    }),
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

const SignUpForm = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const toastId = useId()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Signing up...", { id: toastId })
    setLoading(true)

    const formData = new FormData()
    formData.append("fullName", values.fullName)
    formData.append("email", values.email)
    formData.append("password", values.password)

    const { data, success, error } = await signUp(formData)
    if (!success) {
      toast.error("Failed to Sign Up", { id: toastId })
      setLoading(false)
    } else {
      toast.success(
        "Signed up successfully! Please confirm your email address.",
        {
          id: toastId,
        },
      )
      setLoading(false)
      redirect("/login")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading && <RiLoader4Line size={16} className="mr-1 animate-spin" />}
          Sign Up
        </Button>
      </form>
    </Form>
  )
}

export default SignUpForm
