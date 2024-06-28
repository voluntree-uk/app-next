"use server"

import React from "react";
import { SupabaseDataAccessor } from "@data/supabase";
import { redirect } from "next/navigation";
import { createClient } from "@util/supabase/server";
import UserPage from "app/user/[uid]/user-page";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { uid: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createClient();
  const data = new SupabaseDataAccessor(supabase);

  const user_id = params.uid;
  const hasProfile = await data.hasProfile(user_id);

  if (hasProfile) {
    const profile = await data.getProfile(user_id);

    return {
      title: `@${profile.username} | Voluntreee`
    };
  }

  return {}
}

export default async function Page({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const data = new SupabaseDataAccessor(supabase);

  const user_id = params.uid;
  const hasProfile = await data.hasProfile(user_id);

  const isMe = user?.id === user_id;

  if (!hasProfile) {
    if (isMe) {
      redirect("/auth/setup-profile");
    } else {
      redirect("/");
    }
  } else {
    return <UserPage user_id={user_id} isMe={isMe} />;
  }
}

