import { Box, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { data } from "../../shared/data/supabase";
import { Workshop } from "../../shared/schemas";
import WorkshopCard from "./WorkshopListCard";
import WorkshopListFilter from "./WorkshopListFilter";

interface IProps {
  workshops: Workshop[];
  hideFilter?: boolean;
}

export default function WorkshopList({ workshops, hideFilter }: IProps) {
  return (
    <Box>
      {!hideFilter ? (
        <WorkshopListFilter onFilterChange={(data) => console.log(data)} />
      ) : null}
      <Stack overflow="scroll" spacing={0}>
        {workshops?.map((w) => (
          <WorkshopCard key={w.id} workshop={w} />
        ))}
      </Stack>
    </Box>
  );
}
