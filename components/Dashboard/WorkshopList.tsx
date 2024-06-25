"use client";

import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Workshop } from "@schemas";
import WorkshopListHeading from "@components/Dashboard/WorkshopListHeading";
import WorkshopListCard from "@components/Dashboard/WorkshopListCard";

interface IProps {
  workshops: Workshop[];
  navigate: (id: string) => void;
}

export function WorkshopList({ workshops, navigate }: IProps) {
  return (
    <Box pb="10">
      <WorkshopListHeading workshops={workshops} />
      <Stack spacing={0}>
        {workshops?.map((workshop) => (
          <WorkshopListCard key={workshop.id} workshop={workshop} navigate={navigate} />
        ))}
      </Stack>
    </Box>
  );
}
