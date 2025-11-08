"use server"

import { createClient } from "@util/supabase/server";
import { SupabaseDataAccessor } from "@data/supabase";
import Landing from "@components/Landing/Landing";

export default async function Home() {
  const supabase = createClient();
  const data = new SupabaseDataAccessor(supabase);

  // Fetch all data in parallel
  const [upcomingSessions, platformStats, featuredReviews] = await Promise.all([
    data.getUpcomingSessions(6),
    data.getPlatformStats(),
    data.getFeaturedReviews(4)
  ]);

  return (
    <Landing
      upcomingSessions={upcomingSessions}
      platformStats={platformStats}
      featuredReviews={featuredReviews}
    />
  );
}
