"use server"

import { createClient } from "@/lib/supabase/server"

type ResponseType = {
  error: string | null
  success: boolean
  data: unknown | null
}

export const updateProfile = async (values: {
  fullName: string
}): Promise<ResponseType> => {
  const supabase = await createClient()
  const fullName = values.fullName
  const { data: authUserData, error: authUserErr } =
    await supabase.auth.updateUser({
      data: {
        fullName,
      },
    })
  // Profiles table
  const { data: profileData, error: profileErr } = await supabase
    .from("Profiles")
    .update({ fullName })
    .eq("id", authUserData.user?.id)
  return {
    error:
      authUserErr?.message ||
      profileErr?.message ||
      "Something went wrong in updating profile.",
    success: !authUserErr && !profileErr,
    data: authUserData || null,
  }
}

export const resetPassword = async (values: {
  email: string
}): Promise<ResponseType> => {
  const supabase = await createClient()

  const { data: resetData, error: resetErr } =
    await supabase.auth.resetPasswordForEmail(values.email)

  return {
    error: resetErr?.message || "Something went wrong in updating profile.",
    success: !resetErr,
    data: resetData || null,
  }
}
