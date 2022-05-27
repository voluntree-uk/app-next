import { Box } from "@chakra-ui/react";
import React from "react";
import Layout from "../../components/Layout";
import WorkshopForm from "../../components/WorkshopForm";
import enforceAuthenticated from "../../utils/enforceAuthenticated";

export default function New() {
  return (
    <Layout>
      <Box p={6}>
        <WorkshopForm />
      </Box>
    </Layout>
  );
}

export const getServerSideProps = enforceAuthenticated();
