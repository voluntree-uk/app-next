import { Divider, Heading } from "@chakra-ui/react";
import HeadingBar from "../components/HeadingBar";
import Layout from "../components/Layout";

import enforceAuthenticated from "../utils/enforceAuthenticated";

export default function Home() {
  return (
    <Layout>
      <HeadingBar>
        <Heading
          fontSize={"2xl"}
          color={"white"}
          fontWeight="light"
          pl={8}
          py={4}
        >
          Home
        </Heading>
      </HeadingBar>
      <Divider />
    </Layout>
  );
}

export const getServerSideProps = enforceAuthenticated();
