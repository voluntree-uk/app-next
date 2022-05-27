import { Box } from "@chakra-ui/react";
import React from "react";
import Account from "../../components/Account";
import Layout from "../../components/Layout";
import { useSession } from "../../utils/hooks";

export default function MyProfile() {
  const session = useSession();

  return (
    <Layout>
      <Box p={8}>
        {session && session.user ? <Account session={session} /> : null}
      </Box>
    </Layout>
  );
}
