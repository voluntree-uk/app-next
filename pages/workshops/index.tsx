import { Box, Grid, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import WorkshopCard from "../../components/WorkshopCard";
import { Workshop } from "../../shared/schemas";
import { supabase } from "../../utils/supabaseClient";

export default function Workshops({ data }: { data: Workshop[] }) {
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
          {data.map((w) => (
            <WorkshopCard key={w.id} workshop={w} />
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { data } = await supabase.from("workshops").select("*");
  return { props: { data } };
}
