import { Box, Button, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import React from "react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import { Booking } from "../../shared/schemas";
import { supabase } from "../../utils/supabaseClient";

export default function MyBookings({
  bookings,
  user,
}: {
  bookings: Booking[];
  user: User;
}) {
  console.log(bookings);

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
              <Text>{b.id}</Text>
              <Text>Workshop ID {b.workshop_id}</Text>
              <Button mt={4}>Cancel</Button>
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
    .select("*")
    .eq("user_id", user?.id);

  return { props: { bookings, user } };
}
