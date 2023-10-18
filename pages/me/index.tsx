import React from "react";
import { Box } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { auth } from "@auth/supabase";
import Account from "@components/Account";
import Layout from "@components/Layout/Layout";

export default function MePage({ user }: { user: User }) {
  return (
    <Layout>
      <Box>{user ? <Account user={user} /> : null}</Box>
    </Layout>
  );
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
