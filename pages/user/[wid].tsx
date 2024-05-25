import React from "react";
import { auth } from "@auth/supabase";
import Layout from "@components/Layout/Layout";
import { data } from "@data/supabase";
import UserProfile from "@components/Profile/UserProfile";
import { Profile, Workshop } from "@schemas";
import HostedWorkshops from "@components/Profile/HostedWorkshops";

interface IProps {
  profile: Profile;
  isMe: boolean;
  workshops: Workshop[];
}

export default function UserPage({ profile, isMe, workshops }: IProps) {
  return (
    <Layout>
      <UserProfile profile={profile} isMe={isMe} />
      <HostedWorkshops workshops={workshops} isMe={isMe} />
    </Layout>
  );
}

export async function getServerSideProps({ req, query }: any) {
  const id = query.wid;
  const profile = await data.getProfile(id);
  const workshops = await data.getUserWorkshops(id);

  const current_user = await auth.getUserByCookie(req);

  if (!profile) {
    return { props: {}, redirect: { destination: "/" } };
  }

  return {
    props: {
      profile: profile,
      workshops: workshops,
      isMe: id == current_user?.id,
    },
  };
}
