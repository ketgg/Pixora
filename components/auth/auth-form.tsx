"use client"

import Link from "next/link"
import React, { useState } from "react"

import { Button } from "@/components/ui/button"

import SignInForm from "./signin-form"
import SignUpForm from "./signup-form"
import ResetPasswordForm from "./reset-pass-form"

type Mode = "signin" | "signup" | "reset"

const AuthForm = () => {
  const [mode, setMode] = useState<Mode>("signin")
  return (
    <div className="space-y-6">
      <header className="flex flex-col space-y-1 text-center">
        <h1 className="font-grotesk text-2xl font-semibold tracking-tight">
          {mode === "signin" && "Sign In"}
          {mode === "reset" && "Reset password"}
          {mode === "signup" && "Sign Up"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "signin" && "Enter your email & password to login"}
          {mode === "reset" && "Enter your email to reset your password"}
          {mode === "signup" &&
            "Enter your information below to create an account"}
        </p>
      </header>
      <div className="space-y-4">
        {mode === "signin" && (
          <>
            <SignInForm />
            <div className="flex flex-col items-start justify-between xs:flex-row xs:items-center">
              <Button
                onClick={() => [setMode("signup")]}
                variant="link"
                className="p-0"
              >
                Need an account? Sign Up
              </Button>
              <Button
                onClick={() => [setMode("reset")]}
                variant="link"
                className="p-0"
              >
                Forgot password?
              </Button>
            </div>
          </>
        )}
        {mode === "signup" && (
          <>
            <SignUpForm />
            <div className="flex items-center justify-between">
              <Button
                onClick={() => [setMode("signin")]}
                variant="link"
                className="p-0"
              >
                Already have an account? Sign In
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="#" className="underline hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline hover:text-primary">
                Privacy Policy
              </Link>
            </p>
          </>
        )}
        {mode === "reset" && (
          <>
            <ResetPasswordForm />
            <div className="flex items-center justify-between">
              <Button
                onClick={() => [setMode("signin")]}
                variant="link"
                className="p-0"
              >
                Back to Sign In
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthForm
