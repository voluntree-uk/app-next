import { Box, Container, Heading, Img, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { BookingDetails } from "../../shared/schemas";
import BookingListCard from "./BookingListCard";
import BookingListHeading from "./BookingListHeading";

interface IProps {
  bookings: BookingDetails[];
}

export default function BookingList({ bookings }: IProps) {
  return (
    <Container>
      <Stack spacing={0}>
        {bookings?.map((booking) => (
          <BookingListCard key={booking.id} booking={booking} />
        ))}
      </Stack>
      {bookings.length === 0 ? (
        <Box
          py="20"
          display={"flex"}
          flexDir="column"
          alignItems={"center"}
          justifyContent="center"
        >
          <Img src="https://secure.meetupstatic.com/next/images/home/EmptyGroup.svg?w=384"></Img>
          <Heading size="md" pb="2">
            No workshops joined
          </Heading>
          <Text>All workshops you join will be shown here.</Text>
        </Box>
      ) : null}
    </Container>
  );
}
