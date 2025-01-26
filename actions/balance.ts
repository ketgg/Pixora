import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

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
