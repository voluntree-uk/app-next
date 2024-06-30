"use server"

import { createClient } from "@util/supabase/server";
import AuthenticationForm from "@components/Login/AuthenticationForm";
import { redirect } from "next/navigation";

export default async function Login() {
  
  const signUp = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error: string | undefined }> => {
    "use server";
    
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/callback`,
      },
    });

    return {
      success: error ? false : true,
      error: error?.message,
    };
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean, error: string|undefined }> => {
    "use server";

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message
      }
    } else {
      return {
        success: true,
        error: undefined
      }
    }

  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error: string | undefined }> => {
    "use server";

    const supabase = createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/callback`,
    });

    return {
      success: error ? false : true,
      error: error?.message,
    };

  };

  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/me")

  return <AuthenticationForm signUp={signUp} signIn={signIn} resetPassword={resetPassword} />;
}
