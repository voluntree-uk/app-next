"use server"

import React from "react";
import { SupabaseDataAccessor } from "@data/supabase";
import { redirect } from "next/navigation";
import { createClient } from "@util/supabase/server";
import UserPage from "app/user/[uid]/user-page";

export default async function Page({ params }: { params: any }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const data = new SupabaseDataAccessor(supabase);

  const user_id = params.uid;
  const hasProfile = await data.hasProfile(user_id);

  const isMe = user?.id === user_id;

  if (!hasProfile) {
    if (isMe) {
      redirect("/auth/setup-profile")
    } else {
      redirect("/")
    }
  } else {
    return <UserPage user_id={user_id} isMe={isMe} />
  }

}

