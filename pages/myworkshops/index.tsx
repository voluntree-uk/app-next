import {
  Box,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import React from "react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import WorkshopCard from "../../components/WorkshopCard";
import { Workshop } from "../../shared/schemas";
import { supabase } from "../../utils/supabaseClient";

export default function MyWorkshops({
  workshops,
  category,
}: {
  workshops: Workshop[];
  category: string;
}) {
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
          My Workshops
        </Heading>
      </HeadingBar>

      <Flex p={3} px={2}>
        <StatGroup
          mr={2}
          bg="white"
          p={4}
          borderRadius="lg"
          w={150}
          boxShadow="sm"
          cursor={"pointer"}
          _hover={{ bg: "gray.50" }}
        >
          <Stat>
            <StatLabel>Workshops</StatLabel>
            <StatNumber>{workshops.length}</StatNumber>
          </Stat>
        </StatGroup>

        <StatGroup
          bg="white"
          p={4}
          borderRadius="lg"
          w={150}
          boxShadow="sm"
          cursor={"pointer"}
          _hover={{ bg: "gray.50" }}
        >
          <Stat>
            <StatLabel>Bookings</StatLabel>
            <StatNumber>12</StatNumber>
          </Stat>
        </StatGroup>
      </Flex>

      <Box p={1}>
        <SimpleGrid columns={[1, 2, 3]} spacing={3}>
          {workshops.map((w) => (
            <WorkshopCard key={w.id} workshop={w} />
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (!user) {
    return { props: {}, redirect: { destination: "/auth" } };
  }

  const { data: workshopData, error } = await supabase
    .from("workshops")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return { props: {}, redirect: { destination: "/workshops" } };
  }

  const workshops = workshopData;

  return { props: { workshops } };
}
