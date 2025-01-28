import { redirect } from "next/navigation"
import Image from "next/image"

import React from "react"

import Logo from "@/components/root/logo"

import LoginBackground from "@/assets/images/bg-image.png"
import AuthForm from "@/components/auth/auth-form"

import { getUser } from "@/actions/auth"

const LoginPage = async () => {
  const user = await getUser()
  if (user) redirect("/home")
  return (
    <main className="relative h-screen min-w-72 sm:grid sm:grid-cols-2">
      <section className="relative hidden w-full bg-muted p-8 text-foreground sm:flex sm:flex-col">
        <div className="absolute left-0 top-0 z-10 h-[10%] w-full bg-gradient-to-t from-transparent to-black/10" />
        <div className="absolute bottom-0 left-0 z-10 h-[20%] w-full bg-gradient-to-b from-transparent to-black/10" />
        <Image
          src={LoginBackground}
          alt="Login background"
          fill
          className="h-full w-full object-cover"
        />
        <div className="relative flex items-center">
          <Logo />
        </div>
        <div className="font-grotesk relative z-20 mt-auto font-medium">
          <blockquote className="space-y-2">
            <p className="">
              &ldquo; Pixora is just fantastic! I take amazing photos of my
              wife, family and friends. As a photographer I use it to test ideas
              before creating a real photoshoot. I strongly recommend it!
              &rdquo;
            </p>
            <span className="text-sm">- Iryna</span>
          </blockquote>
        </div>
      </section>

      <section className="relative flex h-full flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </section>
    </main>
  )
}
export default LoginPage
