"use server"

import React from "react";
import { SupabaseDataAccessor } from "@data/supabase";
import { redirect } from "next/navigation";
import UserProfile from "@components/Profile/UserProfile";
import HostedWorkshops from "@components/Profile/HostedWorkshops";
import { createClient } from "@util/supabase/server";

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
    const profile = await data.getProfile(user_id);
    const workshops = await data.getUserWorkshops(user_id);

    return (
      <>
        <UserProfile profile={profile} isMe={isMe} />
        <HostedWorkshops workshops={workshops} isMe={isMe} />
      </>
    );
  }

  

}

