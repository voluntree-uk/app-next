import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import WorkshopForm from "../../components/WorkshopForm";
import enforceAuthenticated from "../../utils/enforceAuthenticated";

export default function New() {
  return (
    <Layout>
      <HeadingBar>
        <Heading
          fontSize={"md"}
          color={"white"}
          fontWeight="semibold"
          pl={8}
          pb={4}
        >
          Create
        </Heading>
      </HeadingBar>
      <Box p={6}>
        <WorkshopForm />
      </Box>
    </Layout>
  );
}

export const getServerSideProps = enforceAuthenticated();
