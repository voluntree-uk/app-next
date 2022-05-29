import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import Account from "../../components/Account";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import enforceAuthenticated from "../../utils/enforceAuthenticated";
import { useSession } from "../../utils/hooks";

export default function MyProfile() {
  const session = useSession();

  return (
    <Layout>
      <Box>
        {session && session.user ? <Account session={session} /> : null}
      </Box>
    </Layout>
  );
}
export const getServerSideProps = enforceAuthenticated();
