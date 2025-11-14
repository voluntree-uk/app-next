"use client";

import { Stack, Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel, Heading, Flex, Button } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { useToast, useDisclosure } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { Booking, Profile, Slot, User, Workshop } from "@schemas";
import { clientData } from "@data/supabase";
import WorkshopListingHeading from "@components/Workshop/WorkshopListingHeading";
import WorkshopListingUpcomingSlotList from "@components/Workshop/WorkshopListingUpcomingSlotList";
import WorkshopListingPastSlotList from "@components/Workshop/WorkshopListingPastSlotList";
import WorkshopListingLocation from "@components/Workshop/WorkshopListingLocation";
import WorkshopListingDescription from "@components/Workshop/WorkshopListingDescription";
import WorkshopListingShare from "@components/Workshop/WorkshopListingShare";
import WorkshopListingUserBooking from "@components/Workshop/WorkshopListingUserBooking";
import { WorkshopListingNewSlotModal } from "@components/Workshop/WorkshopListingNewSlotModal";
import Show from "@components/Helpers/Show";
import { isBeforeNow } from "@util/dates";

interface IProps {
  workshop: Workshop;
  host: Profile;
  slots: Slot[];
  bookings: Booking[];
  user: User | null;
  isUserInterested: boolean;
  numberOfInterestedUsers: number;
}

export default function WorkshopListing({
  workshop,
  host,
  slots,
  bookings,
  user,
  isUserInterested,
  numberOfInterestedUsers,
}: IProps) {
  const userBooking = bookings.find((booking) => {
    const bookingSlot = slots.find((slot) => slot.id == booking.slot_id);
    return (
      booking.user_id == user?.id &&
      bookingSlot &&
      !isBeforeNow(new Date(`${bookingSlot.date}T${bookingSlot.end_time}`))
    );
  });

  const isUserHost = () => user?.id == workshop.user_id;
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const pastSlots = slots
    .filter((slot) => isBeforeNow(new Date(`${slot.date}T${slot.end_time}`)))
    .sort(
      (a, b) =>
        new Date(`${b.date}T${b.end_time}`).getTime() -
        new Date(`${a.date}T${a.end_time}`).getTime()
    )
    .slice(0, 5);
  const futureSlots = slots
    .filter((slot) => !isBeforeNow(new Date(`${slot.date}T${slot.end_time}`)))
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.end_time}`).getTime() -
        new Date(`${b.date}T${b.end_time}`).getTime()
    );

  async function addNewSlot(slot: Slot): Promise<void> {
    try {
      if (slot) {
        const success = await clientData.createSlots([slot]);
        // Redirect if slot created successfully
        if (success) {
          try {
            await fetch("/api/revalidate-homepage", { method: "POST" });
          } catch (err) {
            console.error("Failed to revalidate homepage", err);
          }
          router.refresh();
        }
      }
    } catch (error) {
      const message = (error as any).message;

      toast({
        title: "Problem creating a new session",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  }

  const makeTab = (title: string): ReactElement => {
    return (
      <Tab
        color="gray.600"
        fontWeight="medium"
        _selected={{
          fontWeight: "bold",
          color: "blue.600",
          borderBottomColor: "blue.500",
          borderBottomWidth: "2px",
        }}
        px={4}
        py={2}
      >
        {title}
      </Tab>
    );
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Stack spacing={0}>
        {/* Hero Section */}
        <WorkshopListingHeading workshop={workshop} host={host} user={user} />

        {/* Location */}
        <WorkshopListingLocation workshop={workshop} />

        {/* Description */}
        <WorkshopListingDescription workshop={workshop} user={user} />

        {/* User Booking or Sessions */}
        {userBooking ? (
          <Box bg="white" borderBottomWidth="1px" borderBottomColor="gray.200">
            <Container maxW="7xl" px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}>
              <WorkshopListingUserBooking
                workshop={workshop}
                slot={slots.find((slot) => slot.id == userBooking?.slot_id)!}
                bookings={bookings.filter((booking) => userBooking?.id == booking.id)}
                user_booking={userBooking}
              />
            </Container>
          </Box>
        ) : (
          <Box bg="white" borderBottomWidth="1px" borderBottomColor="gray.200">
            <Container maxW="7xl" px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}>
              <Flex justify="space-between" align="center" mb={6}>
                <Heading as="h2" size="lg" color="gray.700">
                  Sessions
                </Heading>
                <Show showIf={isUserHost()}>
                  <Button
                    variant="solid"
                    colorScheme="teal"
                    rightIcon={<MdAdd />}
                    onClick={onOpen}
                    size="md"
                  >
                    New Session
                  </Button>
                  <WorkshopListingNewSlotModal
                    workshop={workshop}
                    isOpen={isOpen}
                    onClose={onClose}
                    onSubmit={addNewSlot}
                    existingSlots={slots}
                  />
                </Show>
              </Flex>

              {futureSlots.length > 0 || pastSlots.length > 0 ? (
                <Tabs variant="line" colorScheme="blue" defaultIndex={0}>
                  <TabList borderBottomWidth="2px" borderBottomColor="gray.200">
                    {makeTab(`Upcoming (${futureSlots.length})`)}
                    {pastSlots.length > 0 && makeTab(`Past (${pastSlots.length})`)}
                  </TabList>
                  <TabPanels>
                    <TabPanel px={0} pt={6}>
                      <WorkshopListingUpcomingSlotList
                        workshop={workshop}
                        slots={futureSlots}
                        bookings={bookings}
                        user={user}
                        isUserInterested={isUserInterested}
                        numberOfInterestedUsers={numberOfInterestedUsers}
                        isUserHost={isUserHost()}
                        onAddSessionClick={onOpen}
                      />
                    </TabPanel>
                    {pastSlots.length > 0 && (
                      <TabPanel px={0} pt={6}>
                        <WorkshopListingPastSlotList
                          slots={pastSlots}
                          bookings={bookings}
                        />
                      </TabPanel>
                    )}
                  </TabPanels>
                </Tabs>
              ) : (
                <WorkshopListingUpcomingSlotList
                  workshop={workshop}
                  slots={[]}
                  bookings={bookings}
                  user={user}
                  isUserInterested={isUserInterested}
                  numberOfInterestedUsers={numberOfInterestedUsers}
                  isUserHost={isUserHost()}
                  onAddSessionClick={onOpen}
                />
              )}
            </Container>
          </Box>
        )}

        {/* Share Section */}
        <Box bg="white">
          <Container maxW="7xl" px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}>
            <WorkshopListingShare workshop={workshop} />
          </Container>
        </Box>
      </Stack>
    </Box>
  );
}
