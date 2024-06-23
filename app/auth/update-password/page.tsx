"use server";

import { createClient } from "@util/supabase/server";
import UpdatePasswordPage from "./update-password";

export default async function Page() {
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
