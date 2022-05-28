import React from "react";
import Account from "../../components/Account";
import Layout from "../../components/Layout";
import enforceAuthenticated from "../../utils/enforceAuthenticated";
import { useSession } from "../../utils/hooks";

export default function MyProfile() {
  const session = useSession();

  return (
    <Layout>
      {session && session.user ? <Account session={session} /> : null}
    </Layout>
  );
}
export const getServerSideProps = enforceAuthenticated();
