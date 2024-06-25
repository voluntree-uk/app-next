"use client"

import { useCallback, useEffect, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { Workshop, FilterProps, DefaultFilterProps } from "@schemas";
import WorkshopCard from "@components/Workshop/WorkshopListCard";
import WorkshopListFilter from "@components/Workshop/WorkshopListFilter";
import { clientData } from "@data/supabase";
import Loader from "@components/Loader";
import { useRouter } from "next/navigation";


export default function WorkshopList() {
  const router = useRouter();

  const [search, setSearch] = useState<FilterProps>(DefaultFilterProps);
  const [workshops, setWorkshops] = useState<Workshop[]>();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const filterWorkshops = useCallback(async (filters: FilterProps) => {
    setLoadingMessage("Searching for workshops");
    setLoading(true);
    const foundWorkshops = await clientData.filterAvailableWorkshops(filters);
    setWorkshops(foundWorkshops);
    setLoading(false);
  }, []);

  useEffect(() => {
    filterWorkshops(search);
  }, [search, filterWorkshops]);

  const navigateToWorkshop = ((workshop: Workshop) => {
    setLoadingMessage("Fetching workshop details");
    setLoading(true);
    router.push(`/workshops/${workshop.id}`);
  })

  return (
    <Box>
      <WorkshopListFilter onFilterChange={(data) => setSearch(data)} />
      {loading ? (
        <Loader message={loadingMessage} />
      ) : (
        <Stack spacing={0}>
          {workshops?.map((w) => (
            <WorkshopCard key={w.id} workshop={w} navigate={navigateToWorkshop} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
