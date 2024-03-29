import { useCallback, useEffect, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { Workshop, FilterProps, DefaultFilterProps } from "@schemas";
import WorkshopCard from "@components/Workshop/WorkshopListCard";
import WorkshopListFilter from "@components/Workshop/WorkshopListFilter";
import { data } from "@data/supabase";

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
