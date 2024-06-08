"use server"

import { headers } from "next/headers";
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

    const origin = headers().get("origin");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
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
    
    const origin = headers().get("origin");

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${origin}/auth/update-password` }
    );

    return {
      success: error ? false : true,
      error: error?.message,
    };

  };

  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/workshops") 

  return <AuthenticationForm signUp={signUp} signIn={signIn} resetPassword={resetPassword} />;
}
