import { Box, Button, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React from "react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import { BookingExt } from "../../shared/schemas";
import { supabase } from "../../utils/supabaseClient";
import { dateToReadable, timeToReadable } from "../../utils/dates";

export default function MyBookings({
  bookings,
}: {
  bookings: BookingExt[];
  user: User;
}) {
  const router = useRouter();

  const directToCancelBooking = (booking: BookingExt) => {
    router.push(`/bookings/cancel?booking_id=${booking.id}`);
  };

  return (
    <Layout>
      <HeadingBar>
        <Heading
          fontSize={"md"}
          color={"white"}
          fontWeight="semibold"
          pl={8}
          pb={4}
        >
          Bookings
        </Heading>
      </HeadingBar>
      <Box p={2}>
        <SimpleGrid columns={[1, 2, 3]} spacing={3}>
          {bookings.map((b) => (
            <Box key={b.id} p={4} borderRadius="lg" bg="gray.50" boxShadow="sm">
              <Text>{b.workshops?.name}</Text>
              <Text>{dateToReadable(b.slots.date)} {timeToReadable(b.slots?.start_time, b.slots?.end_time)}</Text>
              <Button mt={4} onClick={() => directToCancelBooking(b)}>
                Cancel
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps({ req }: any) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return { props: {}, redirect: { destination: "/auth" } };
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      workshops:workshop_id(name),
      slots:slot_id(date, start_time, end_time)
    `)
    .eq("user_id", user?.id);

  return { props: { bookings, user } };
}
