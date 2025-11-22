"use server";

import { redirect } from "next/navigation";
import { createClient } from "@util/supabase/server";
import { SupabaseDataAccessor } from "@data/supabase";
import SetupProfilePage from "./setup-profile-page";

export default async function Page() {
  const supabase = createClient();
  const data = new SupabaseDataAccessor(supabase);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const hasProfile = await data.hasProfile(user.id);

  if (hasProfile) redirect("/me");

  const setupProfile = async (
    firstName: string,
    lastName: string,
    dob: string,
    username: string
  ): Promise<{ success: boolean; error?: string }> => {
    "use server";
    const supabase = createClient();
    const data = new SupabaseDataAccessor(supabase);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to create a profile",
      };
    }

    const values = {
      user_id: user.id,
      username: username,
      email: user.email,
      name: firstName,
      surname: lastName,
      dob: dob,
    };

    try {
      await data.createProfile(values);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: "username_taken",
      };
    }
  };

  return <SetupProfilePage user={user} setupProfile={setupProfile} />;
}
