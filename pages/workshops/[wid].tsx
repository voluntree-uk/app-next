import { AddIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Img,
  Text,
} from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import { FaUsers } from "react-icons/fa";
import Layout from "../../components/Layout";
import { Booking, Slot, Workshop } from "../../shared/schemas";
import { dateToReadable, timeToReadable } from "../../utils/dates";
import { supabase } from "../../utils/supabaseClient";

export default function WorkshopListing({
  workshop,
  slots,
  bookings,
  user,
}: {
  workshop: Workshop;
  slots: Slot[];
  bookings: Booking[];
  user: User;
}) {
  const [slotSelected, setSlotSelected] = useState<Slot>(slots[0]);

  const getActiveBookingsForSlot = (slot: Slot): Booking[] => {
    return bookings.filter((b) => b.slot_id === slot.id && b.active);
  };

  const slotIsFullyBooked = (): boolean => {
    return (
      slotSelected.capacity - getActiveBookingsForSlot(slotSelected).length ===
      0
    );
  };

  const directToNewBooking = () => {
    router.push(
      `/bookings/new?workshop_id=${slotSelected.workshop_id}&slot_id=${slotSelected.id}`
    );
  };

  const userOwnsWorkshop = () => {
    return user.id === workshop.user_id;
  };

  const userHasBookedSlot = () => {
    return bookings
      .filter((b) => b.active)
      .some((b) => b.slot_id === slotSelected.id && b.user_id === user.id);
  };

  const cancelUserBooking = () => {
    const booking = bookings.find((b) => b.user_id === user.id)
    if (booking) {
      router.push(`/bookings/cancel?booking_id=${booking.id}`);
    }
  }

  const router = useRouter();

  const getBookButtonIcon = (): ReactElement => {
    if (userOwnsWorkshop()) {
      return <EditIcon />;
    }
    if (userHasBookedSlot()) {
      return <CloseIcon />;
    }
    if (!slotIsFullyBooked() && !userHasBookedSlot() && !userOwnsWorkshop()) {
      return <AddIcon />;
    }
    if (slotIsFullyBooked()) {
      return <FaUsers />;
    }
    return <AddIcon />;
  };

  const getBookButtonText = (): string => {
    if (userOwnsWorkshop()) {
      return "Manage Booking"
    } else if (userHasBookedSlot()) {
      return "Cancel Booking"
    } else if (userCanBook()) {
      return "Book"
    } else if (slotIsFullyBooked()) {
      return "Booking Full"
    }
    return ""
  }

  const userCanBook = () => {
    return !slotIsFullyBooked() && !userHasBookedSlot() && !userOwnsWorkshop();
  };

  return (
    <Layout>
      <Box w={{ base: "full", md: "45vw" }} m={"0  auto"}>
        <Img
          alt=""
          src="https://www.namecoinnews.com/wp-content/uploads/2021/03/Basic-Forex-Trading-Styles.jpg"
        />
        <Flex
          py={4}
          px={4}
          alignItems="center"
          mx={2}
          my={2}
          color="gray.600"
          bg="white"
          borderLeftWidth={5}
          borderBottomWidth={5}
        >
          <Heading fontSize={"22px"} fontWeight={"semibold"}>
            {workshop.name}
          </Heading>
        </Flex>
        <Box>
          <Box px={4} pt={4} bg="white" mx={2}>
            <Flex alignItems={"center"}>
              <Img
                src="https://bit.ly/dan-abramov"
                h="50"
                w="50"
                borderRadius={"100%"}
                alt=""
                mr={3}
              />
              <Flex flexDirection={"column"}>
                <Heading
                  fontSize={"sm"}
                  fontWeight={"semibold"}
                  letterSpacing="wide"
                >
                  {"Organiser"}
                </Heading>
                <Text fontSize={"sm"} color={"gray.600"}>
                  {workshop.user_id}
                </Text>
              </Flex>
            </Flex>
            <Divider pt={3} />
          </Box>

          <Box px={4} py={4} bg="white" mx={2}>
            <Flex alignItems={"center"}>
              <Img
                src={"/map.svg"}
                h="50"
                w="50"
                borderRadius={"100%"}
                alt=""
                mr={3}
              />
              <Flex flexDirection={"column"}>
                <Heading
                  fontSize={"sm"}
                  fontWeight={"semibold"}
                  letterSpacing="wide"
                >
                  {"Location"}
                </Heading>
                <Text fontSize={"sm"} color={"gray.600"}>
                  {workshop.virtual ? "Virtual" : workshop.street}
                </Text>
              </Flex>
            </Flex>
            <Divider pt={3} />
          </Box>

          <Box bg="white" mx={2} px={8} pb={4} color="gray.600">
            <Text fontSize={"sm"} fontWeight={"normal"}>
              {workshop.description}
            </Text>
          </Box>

          <Box bg="white" mx={2} my={2}>
            {slots.map((slot, i) => (
              <Flex
                key={i}
                px={3}
                py={2}
                justifyContent="space-between"
                alignItems={"center"}
                cursor={"pointer"}
                onClick={() => setSlotSelected(slot)}
                bg={slotSelected.id === slot.id ? "green.50" : "none"}
                borderLeftColor={
                  slotSelected.id === slot.id ? "green.400" : "none"
                }
                borderLeftWidth={5}
              >
                <Flex flexDirection="column">
                  <Text fontSize={"sm"} fontWeight="medium">
                    {dateToReadable(slot.date)}
                  </Text>
                  <Text fontSize={"sm"} fontWeight="normal" color="gray.500">
                    {timeToReadable(slot.start_time, slot.end_time)}
                  </Text>
                </Flex>
                <Box>
                  <Badge variant={"subtle"} colorScheme="green">
                    {slot.capacity - getActiveBookingsForSlot(slot).length}{" "}
                    spaces
                  </Badge>
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>
        <Box
          borderColor={"gray.200"}
          borderWidth={"thin"}
          p={3}
          bottom={"0%"}
          pos={{ base: "fixed", md: "inherit" }}
          w={{ base: "100%", md: "45vw" }}
          bg="white"
        >
          <Flex justifyContent={"space-between"} alignItems="center">
            <Flex flexDir={"column"} p={2}>
              <Text fontWeight={"normal"} fontSize="sm">
                {dateToReadable(slotSelected.date)}
              </Text>
              <Text fontWeight={"normal"} fontSize="sm" color="gray.500">
                {timeToReadable(slotSelected.start_time, slotSelected.end_time)}
              </Text>
            </Flex>
            <Button
              color={"white"}
              variant="contained"
              bg={userHasBookedSlot() ? "red.300" : "brand.700"}
              boxShadow="xl"
              w={"30%"}
              leftIcon={getBookButtonIcon()}
              size="sm"
              disabled={slotIsFullyBooked() && !userHasBookedSlot()}
              onClick={() => {
                {
                  if (userOwnsWorkshop()) {
                    router.push("/dashboard");
                  } else if (userHasBookedSlot()) {
                    cancelUserBooking()
                  } else if (userCanBook()) {
                    directToNewBooking();
                  }
                }
              }}
              _hover={{ bg: userHasBookedSlot() ? "red.300" : "brand.700" }}
            >
              {getBookButtonText()}
            </Button>
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const id = context.query.wid;

  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (!user) {
    return { props: {}, redirect: { destination: "/auth" } };
  }

  const { data: workshopData, error } = await supabase
    .from("workshops")
    .select("*")
    .eq("id", id);

  if (error) {
    return { props: {}, redirect: { destination: "/workshops" } };
  }

  if (!workshopData) {
    return { props: {}, redirect: { destination: "/workshops" } };
  }

  const { data: slotsData } = await supabase
    .from("slots")
    .select("*")
    .eq("workshop_id", workshopData[0].id);

  const { data: bookingsData } = await supabase
    .from("bookings")
    .select("*")
    .eq("workshop_id", workshopData[0].id);

  const workshop = workshopData[0];
  const slots = slotsData;
  const bookings = bookingsData;

  return { props: { workshop, slots, bookings, user } };
}
