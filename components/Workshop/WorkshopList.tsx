import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { Workshop } from "../../shared/schemas";
import WorkshopCard from "./WorkshopListCard";
import WorkshopListFilter from "./WorkshopListFilter";
import { data } from "../../shared/data/supabase";
import { useCallback, useEffect, useState } from "react";
import { FilterProps, DefaultFilterProps } from "../../shared/schemas";

interface IProps {
  hideFilter?: boolean;
}

export default function WorkshopList({ hideFilter }: IProps) {
  const [search, setSearch] = useState<FilterProps>(DefaultFilterProps);
  const [workshops, setWorkshops] = useState<Workshop[]>();

  const filterWorkshops = useCallback(async (filters: FilterProps) => {
    console.log(`Filtering workshops on ${JSON.stringify(filters)}`)
    const foundWorkshops = await data.filterAvailableWorkshops(filters);
    setWorkshops(foundWorkshops);
  }, []);

  useEffect(() => {
    filterWorkshops(search);
  }, [search, filterWorkshops]);

  return (
    <Box>
      {!hideFilter ? (
        <WorkshopListFilter onFilterChange={(data) => setSearch(data)} />
      ) : null}
      <Stack overflow="scroll" spacing={0}>
        {workshops?.map((w) => (
          <WorkshopCard key={w.id} workshop={w} />
        ))}
      </Stack>
    </Box>
  );
}
