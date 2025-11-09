"use server"

import { createBrowserlessClient } from "@util/supabase/server";
import { unstable_cache } from "next/cache";
import { SupabaseDataAccessor } from "@data/supabase";
import Landing from "@components/Landing/Landing";

const getHomepageData = unstable_cache(async () => {
  const supabase = createBrowserlessClient();
  const data = new SupabaseDataAccessor(supabase);

  const [upcomingSessions, platformStats] = await Promise.all([
    data.getUpcomingSessions(6),
    data.getPlatformStats(),
  ]);

  return { upcomingSessions, platformStats };
}, ["homepage-data"], { revalidate: 3600 });

export default async function Home() {
  const { upcomingSessions, platformStats } = await getHomepageData();

  return (
    <Landing
      upcomingSessions={upcomingSessions}
      platformStats={platformStats}
    />
  );
}
