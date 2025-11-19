"use server";

import { createBrowserlessClient } from "@util/supabase/server";
import { unstable_cache } from "next/cache";
import { SupabaseDataAccessor } from "@data/supabase";
import WorkshopList from "@components/Workshop/WorkshopList";
import { FilterProps, DefaultFilterProps, TimeFilter, SortOption } from "@schemas";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

function parseFiltersFromSearchParams(searchParams: PageProps["searchParams"]): FilterProps {
  return {
    text: (searchParams.text as string) || DefaultFilterProps.text,
    category: (searchParams.category as string) || DefaultFilterProps.category,
    time: (searchParams.time as TimeFilter) || DefaultFilterProps.time,
    sort: (searchParams.sort as SortOption) || DefaultFilterProps.sort,
  };
}

function getWorkshopsData(filters: FilterProps) {
  return unstable_cache(
    async () => {
      const supabase = createBrowserlessClient();
      const data = new SupabaseDataAccessor(supabase);
      return await data.filterAvailableWorkshops(filters);
    },
    [`workshops-${filters.text}-${filters.category}-${filters.time}-${filters.sort}`],
    { revalidate: 300 } // Revalidate every 5 minutes
  )();
}

export default async function Workshops({ searchParams }: PageProps) {
  const filters = parseFiltersFromSearchParams(searchParams);
  const workshops = await getWorkshopsData(filters);

  return <WorkshopList workshops={workshops} initialFilters={filters} />;
}
