"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

import { PACKS } from "@/constants/packs"

export const getUserBalance = async () => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthenticated")
    }

    const { data, error } = await supabase
      .from("Profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (error) {
      throw new Error("Error getting user balance")
    }

    return {
      error: null,
      success: true,
      data: data.credits,
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while getting user balance",
      success: false,
      data: null,
    }
  }
}

export const updateUserBalance = async (packId: string) => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthenticated")
    }

    // Fetch the current credits of the user
    const { data: profileData, error: fetchError } = await supabase
      .from("Profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      throw new Error("Error getting user balance")
    }

    // Calculate the new credits balance
    const currentCredits = profileData.credits || 0 // Default to 0 if credits is null
    const pack = PACKS.find((pack) => pack.id === packId)
    const newCredits = currentCredits + (pack?.credits ?? 0)

    // Update the user's credits in the Profiles table
    const { data: updateData, error: updateError } = await supabase
      .from("Profiles")
      .update({ credits: newCredits })
      .eq("id", user.id)

    if (updateError) {
      throw new Error("Error updating user balance")
    }

    revalidatePath(`/billing`)
    // Return the updated credits balance
    return {
      error: null,
      success: true,
      data: { credits: newCredits },
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while updating user balance.",
      success: false,
      data: null,
    }
  }
}

export const decrementUserCredits = async (credits: number) => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthenticated")
    }

    // Fetch the current credits of the user
    const { data: profileData, error: fetchError } = await supabase
      .from("Profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (fetchError) {
      throw new Error("Error getting user balance")
    }

    // Calculate the new credits balance after decrementing
    const currentCredits = profileData.credits || 0 // Default to 0 if credits is null
    const newCredits = currentCredits - credits

    // Ensure the credits do not go below zero (optional, depending on your use case)
    if (newCredits < 0) {
      throw new Error("Insufficient credits")
    }

    // Update the user's credits in the Profiles table
    const { data: updateData, error: updateError } = await supabase
      .from("Profiles")
      .update({ credits: newCredits })
      .eq("id", user.id)

    if (updateError) {
      throw new Error("Error updating user balance")
    }

    // TODO - Maintain a global state for userBalance

    // Return the updated credits balance
    return {
      error: null,
      success: true,
      data: { credits: newCredits },
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while decrementing user credits",
      success: false,
      data: null,
    }
  }
}
