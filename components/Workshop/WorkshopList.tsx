"use client"

import { useCallback, useEffect, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Workshop, FilterProps, DefaultFilterProps } from "@schemas";
import WorkshopCard from "@components/Workshop/WorkshopListCard";
import WorkshopListFilter from "@components/Workshop/WorkshopListFilter";
import { clientData } from "@data/supabase";
import Loader from "@components/Loader";
import { useRouter } from "next/navigation";
import Show from "@components/Helpers/Show";
import NoResults from "@components/NoResults";


export default function WorkshopList() {
  const router = useRouter();

  const [search, setSearch] = useState<FilterProps>(DefaultFilterProps);
  const [workshops, setWorkshops] = useState<Workshop[]>();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const filterWorkshops = useCallback(async (filters: FilterProps) => {
    setLoadingMessage("Searching for workshops");
    setLoading(true);
    try {
      const foundWorkshops = await clientData.filterAvailableWorkshops(filters);
      setWorkshops(foundWorkshops);
    } catch (error) {
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
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
        <Loader message={loadingMessage} fullScreen/>
      ) : (
        <Stack spacing={0}>
          {workshops?.map((w) => (
            <WorkshopCard
              key={w.id}
              workshop={w}
              navigate={navigateToWorkshop}
            />
          ))}
          <Show showIf={!loading && workshops?.length === 0}>
            <NoResults message="No Workshops Found" />
          </Show>
        </Stack>
      )}
    </Box>
  );
}
