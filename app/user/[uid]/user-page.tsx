"use client";

import React, { useEffect, useState } from "react";
import { Profile, Workshop } from "@schemas";
import { clientData } from "@data/supabase";
import Loader from "@components/Loader";
import UserProfile from "@components/Profile/UserProfile";
import HostedWorkshops from "@components/Profile/HostedWorkshops";

export default function UserPage({
  user_id,
  isMe
}: {
  user_id: string,
  isMe: boolean
}) {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[] | null>(null);

  useEffect(() => {
    clientData
      .getProfile(user_id)
      .then(setProfile);
    clientData
      .getUserWorkshops(user_id)
      .then(setWorkshops);
  }, []);

  useEffect(() => {
    if (profile && workshops) {
      setLoading(false);
    }
  }, [profile, workshops]);

  return (
    <>
      {loading ? (
        <Loader message={"Fetching user profile"} fullScreen/>
      ) : (
        <>
          <UserProfile profile={profile!} isMe={isMe} />
          <HostedWorkshops workshops={workshops!} isMe={isMe} />
        </>
      )}
    </>
  );
}
