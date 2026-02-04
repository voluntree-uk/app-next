"use server";

import WorkshopListing from "@components/Workshop/WorkshopListing";
import { SupabaseDataAccessor } from "@data/supabase";
import { createClient } from "@util/supabase/server";
import { Metadata, ResolvingMetadata } from "next";
import { BookingDetails, WorkshopReview, Profile } from "@schemas";
import { isBeforeNow, parseUTCDateTime } from "@util/dates";

type Props = {
  params: { wid: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createClient();
  const data = new SupabaseDataAccessor(supabase);

  const id = params.wid;
  try {
    const workshop = await data.getWorkshop(id);
    return {
      title: `${workshop.name} | Voluntreee`,
      openGraph: {
        images: [`${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/${workshop.category}_sm.png`],
      },
    };
  } catch (err) {
    return {
      title: `Voluntreee`
    };
  }
}

export default async function Page({ params }: Props) {
  const supabase = createClient();
  const data = new SupabaseDataAccessor(supabase);

  const id = params.wid;

  const workshop = await data.getWorkshop(id);
  const host = await data.getProfile(workshop.user_id);
  const slots = await data.getWorkshopSlots(id);
  const bookings = await data.getWorkshopBookings(id);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isCurrentUserInterested = user ? await data.isUserInterestedInWorkshop(id, user.id) : false;
  const numberOfInterestedUsers = await data.getWorkshopInterestCount(id);

  // Compute reviews from past bookings with review_rating
  const reviewedBookings = (bookings as BookingDetails[]).filter((booking) => {
    if (!booking.review_rating || !booking.slot) return false;
    return isBeforeNow(booking.slot.date, booking.slot.end_time);
  });

  // Sort by slot date (most recent first) and take first 20
  const sortedReviewedBookings = reviewedBookings
    .sort((a, b) => {
      const dateA = parseUTCDateTime(a.slot.date, a.slot.end_time).getTime();
      const dateB = parseUTCDateTime(b.slot.date, b.slot.end_time).getTime();
      return dateB - dateA;
    })
    .slice(0, 20);

  // Get unique user IDs and fetch profiles
  const reviewerUserIds = Array.from(
    new Set(sortedReviewedBookings.map((booking) => booking.user_id))
  );
  const reviewerProfiles = reviewerUserIds.length > 0 ? await data.getProfiles(reviewerUserIds) : [];

  // Build WorkshopReview array with reviewer profiles
  const profileMap = new Map(reviewerProfiles.map((profile) => [profile.user_id, profile]));
  const reviews: WorkshopReview[] = sortedReviewedBookings.map((booking) => {
    const reviewer = profileMap.get(booking.user_id) || {
      user_id: booking.user_id,
      name: undefined,
      username: undefined,
      share_full_name_consent: false,
    } as Partial<Profile> as Profile;
    return { booking, reviewer };
  });

  return (
    <WorkshopListing
      workshop={workshop}
      host={host}
      slots={slots}
      bookings={bookings}
      user={user}
      isUserInterested={isCurrentUserInterested}
      numberOfInterestedUsers={numberOfInterestedUsers}
      reviews={reviews}
    />
  );
}
