"use client"

import React from "react";
import {
  Heading,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { Workshop } from "@schemas";
import HostedWorkshopCard from "@components/Profile/HostedWorkshopCard";
import NoHostedWorkshopsFound from "@components/Profile/NoHostedWorkshopsFound";
import Show from "@components/Helpers/Show";

interface IProps {
  workshops: Workshop[];
  isMe: boolean;
  navigate: (id: string) => void;
}

export default function HostedWorkshops({ workshops, isMe, navigate }: IProps) {
  return (
    <Box p="1em">
      <Heading pb="0.5em" size={"lg"} color={"gray.700"}>
        Workshops
      </Heading>
      <Show showIf={workshops.length > 0}>
        <SimpleGrid minChildWidth="15em" spacing="1em">
          {workshops?.map((w) => (
            <HostedWorkshopCard key={w.id} workshop={w} navigate={navigate} />
          ))}
        </SimpleGrid>
      </Show>
      <Show showIf={workshops.length == 0}>
        <NoHostedWorkshopsFound isMe={isMe} />
      </Show>
    </Box>
  );
}
