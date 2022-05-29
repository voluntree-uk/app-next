import {
  Box,
  Divider,
  Flex,
  Heading,
  Img,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Workshop } from "../../shared/schemas";
import { supabase } from "../../utils/supabaseClient";

export default function WorkshopListing({ data }: { data: Workshop[] }) {
  const [loaded, setLoaded] = useState(false);
  4;
  const workshop = data[0];
  return (
    <Layout>
      <Box>
        <Skeleton isLoaded={loaded}>
          <Img
            alt=""
            onLoad={() => setLoaded(true)}
            src="https://www.namecoinnews.com/wp-content/uploads/2021/03/Basic-Forex-Trading-Styles.jpg"
          />
        </Skeleton>
        <Box p={4} borderTopWidth={1} borderTopColor="gray.300">
          <Heading size={"lg"} mb={3}>
            {workshop.name}
          </Heading>
          <Text>{workshop.description}</Text>
        </Box>
      </Box>
    </Layout>
  );
}
export async function getServerSideProps(context: any) {
  const id = context.query.wid;

  let { data, error } = await supabase
    .from("workshops")
    .select("*")
    .eq("id", id);

  if (error) {
    return { props: {}, redirect: { destination: "/workshops" } };
  }

  return { props: { data } };
}
