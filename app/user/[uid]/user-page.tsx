"use client";

import React, { useEffect, useState } from "react";
import { Profile, Workshop } from "@schemas";
import { clientData } from "@data/supabase";
import Loader from "@components/Loader";
import UserProfile from "@components/Profile/UserProfile";
import HostedWorkshops from "@components/Profile/HostedWorkshops";
import { useRouter } from "next/navigation";

export default function UserPage({
  user_id,
  isMe
}: {
  user_id: string,
  isMe: boolean
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Fetching user profile");

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

  const navigateToWorkshop = (id: string) => {
    setLoadingMessage("Fetching workshop details");
    setLoading(true);
    router.push(`/workshops/${id}`);
  };

  return (
    <>
      {loading ? (
        <Loader message={loadingMessage} fullScreen/>
      ) : (
        <>
          <UserProfile profile={profile!} isMe={isMe} />
          <HostedWorkshops workshops={workshops!} isMe={isMe} navigate={navigateToWorkshop} />
        </>
      )}
    </>
  );
}
