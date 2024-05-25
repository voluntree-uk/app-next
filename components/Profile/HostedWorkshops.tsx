import React from "react";
import {
  Heading,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { Workshop } from "@schemas";
import HostedWorkshopCard from "@components/Profile/HostedWorkshopCard";
import NoHostedWorkshopsFound from "@components/Profile/NoHostedWorkshopsFound";

interface IProps {
  workshops: Workshop[];
  isMe: boolean;
}

export default function HostedWorkshops({ workshops, isMe }: IProps) {
  return (
    <Box p="1em">
      <Heading pb="0.5em" size={"lg"} color={"gray.700"}>
        Workshops
      </Heading>
      {workshops.length > 0 ? (
        <SimpleGrid minChildWidth="15em" spacing="1em">
          {workshops?.map((w) => (
            <HostedWorkshopCard key={w.id} workshop={w} />
          ))}
        </SimpleGrid>
      ) : (
        <NoHostedWorkshopsFound isMe={isMe} />
      )}
    </Box>
  );
}
