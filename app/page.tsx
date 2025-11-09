"use server"

import { createClient } from "@util/supabase/server";
import { SupabaseDataAccessor } from "@data/supabase";
import Landing from "@components/Landing/Landing";

export default async function Home() {
  const supabase = createClient();
  const data = new SupabaseDataAccessor(supabase);

  const [upcomingSessions, platformStats] = await Promise.all([
    data.getUpcomingSessions(6),
    data.getPlatformStats(),
  ]);

  return (
    <Landing
      upcomingSessions={upcomingSessions}
      platformStats={platformStats}
    />
  );
}
