"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

type AuthResponse = {
  error: string | null
  success: boolean
  data: unknown | null
}

export const signUp = async (formData: FormData): Promise<AuthResponse> => {
  const supabase = await createClient()
  const authData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        fullName: formData.get("fullName") as string,
      },
    },
  }
  const { data: signUpData, error } = await supabase.auth.signUp(authData)
  // console.log(error?.message, error?.cause)
  // Add initial credits of 10 to UserBalance table
  // Handled through triggers in SupaBase
  return {
    error: error?.message || "There was some error signing up",
    success: !error,
    data: signUpData || null,
  }
}

export const signIn = async (formData: FormData): Promise<AuthResponse> => {
  const supabase = await createClient()
  const authData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }
  const { data: signInData, error } =
    await supabase.auth.signInWithPassword(authData)
  return {
    error: error?.message || "There was some error signing in",
    success: !error,
    data: signInData || null,
  }
}

export const signOut = async (): Promise<void> => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
