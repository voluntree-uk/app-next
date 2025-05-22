"use server";

import WorkshopListing from "@components/Workshop/WorkshopListing";
import { SupabaseDataAccessor } from "@data/supabase";
import { createClient } from "@util/supabase/server";
import { Metadata, ResolvingMetadata } from "next";

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

  const isCurrentUserInterested = user ? await data.checkUserInterestInWorkshop(id, user.id) : false;
  const numberOfInterestedUsers = await data.getWorkshopInterestCount(id);

  return (
    <WorkshopListing
      workshop={workshop}
      host={host}
      slots={slots}
      bookings={bookings}
      user={user}
      isUserInterested={isCurrentUserInterested}
      numberOfInterestedUsers={numberOfInterestedUsers}
    />
  );
}
