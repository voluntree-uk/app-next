import Layout from "@/components/Layout/Layout";
import { Box, Container } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import React from "react";
import Account from "../../components/Account";
import { auth } from "../../shared/auth/supabase";

export default function MePage({ user }: { user: User }) {
  return <Layout>{user ? <Account user={user} /> : null}</Layout>;
}

export async function getServerSideProps({ req }: any) {
  const user = await auth.getUserByCookie(req);

  if (!user) {
    return { props: {}, redirect: { destination: "/" } };
  }

  return {
    props: { user },
  };
}
