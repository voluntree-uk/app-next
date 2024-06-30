"use server";

import { createClient } from "@util/supabase/server";
import UpdatePasswordPage from "./update-password";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login`);
  }

  const updatePassword = async (
    password: string
  ): Promise<{ success: boolean; error: string | undefined }> => {
    "use server";

    const supabase = createClient();

    const { data, error } = await supabase.auth.updateUser({
      password: password
    });

    return {
      success: error ? false : true,
      error: error?.message,
    };
  };

  return <UpdatePasswordPage updatePassword={updatePassword} />;
}
