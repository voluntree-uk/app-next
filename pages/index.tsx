import { Box } from "@chakra-ui/react";
import Layout from "../components/Layout";

import enforceRedirect from "../utils/enforceRedirect";

export default function Home() {
  return (
    <Layout>
      <Box></Box>
    </Layout>
  );
}

export const getServerSideProps = enforceRedirect();
