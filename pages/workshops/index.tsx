import { Box, Grid, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import WorkshopCard from "../../components/WorkshopCard";

export default function Workshops() {
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
          Workshops
        </Heading>
      </HeadingBar>
      <Box bg="gray.100">
        <SimpleGrid columns={1} spacing={3}>
          <WorkshopCard />
          <WorkshopCard />
          <WorkshopCard />
          <WorkshopCard />
          <WorkshopCard />
        </SimpleGrid>
      </Box>
    </Layout>
  );
}
