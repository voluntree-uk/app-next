import React from "react";
import {
  Heading,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { Workshop } from "@schemas";
import HostedWorkshopCard from "@components/Profile/HostedWorkshopCard";

interface IProps {
  workshops: Workshop[];
}

export default function HostedWorkshops({ workshops }: IProps) {
  return (
    <Box p="1em">
      <Heading pb="0.5em" size={"lg"} color={"gray.700"}>
        Workshops
      </Heading>
      <SimpleGrid minChildWidth="15em" spacing="1em">
        {workshops?.map((w) => (
          <HostedWorkshopCard key={w.id} workshop={w} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
