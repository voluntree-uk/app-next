import { Grid, GridItem } from "@chakra-ui/react";
import Account from "../components/Account";
import Layout from "../components/Layout";
import WorkshopCard from "../components/WorkshopCard";
import enforceAuthenticated from "../utils/enforceAuthenticated";
import { useSession } from "../utils/hooks";

export default function Home() {
  return (
    <Layout>
      <div></div>
    </Layout>
  );
}

export const getServerSideProps = enforceAuthenticated();
