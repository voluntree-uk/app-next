import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";
import React from "react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";

export default function Workshops() {
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
          Workshops
        </Heading>
      </HeadingBar>
      <Box p={2}></Box>
    </Layout>
  );
}
