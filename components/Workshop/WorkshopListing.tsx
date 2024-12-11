"use client";

import { Stack, Box } from "@chakra-ui/react";
import { Button, Heading, Tabs, TabList, TabPanels, 
  Tab, TabPanel, useToast, useDisclosure} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/navigation";
import { Booking, Profile, Slot, User, Workshop } from "@schemas";
import { MdAdd } from "react-icons/md";
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
}

export default function WorkshopListing({
  workshop,
  host,
  slots,
  bookings,
  user,
}: IProps) {
  const userBooking = bookings.find((booking) => {
    const bookingSlot = slots.find((slot) => slot.id == booking.slot_id);
    return (
      booking.user_id == user?.id && bookingSlot && !isBeforeNow(new Date(`${bookingSlot.date}T${bookingSlot.end_time}`))
    );
  });

  const isUserHost = () => user?.id == workshop.user_id;
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const pastSlots = slots.filter((slot) => isBeforeNow(new Date(`${slot.date}T${slot.end_time}`)));
  const futureSlots = slots.filter((slot) => !isBeforeNow(new Date(`${slot.date}T${slot.end_time}`)));


  async function addNewSlot(slot: Slot): Promise<void> {
    try {
      if (slot) {
        const success = await clientData.createSlots([slot]);
        // Redirect if slot created successfully
        if (success) {
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

  return (
    <Stack>
      <WorkshopListingHeading workshop={workshop} host={host} user={user} />
      <WorkshopListingLocation workshop={workshop} />
      <WorkshopListingDescription workshop={workshop} />
      {userBooking ? (
        <WorkshopListingUserBooking
          workshop={workshop}
          slot={slots.find((slot) => slot.id == userBooking?.slot_id)!}
          bookings={bookings.filter((booking) => userBooking?.id == booking.id)}
          user_booking={userBooking}
        />
      ) : (
      <Box
        borderBottomWidth={"1px"}
        borderBottomColor="gray.200"
       
        rounded="md"
        px={{ base: "6", md: "16" }}
      >
        <Box 
         py="6"
         display="flex"
         justifyContent={"space-between"}
         alignItems={"center"}
         >
          <Heading as="h2" size="md" pb="0.5em">
            Availability
          </Heading>
          <Show showIf={isUserHost()}>
            <Button
              variant="solid"
              colorScheme="teal"
              rightIcon={<MdAdd />}
              onClick={onOpen}
              mx="4"
              >
                New Session
            </Button>
          
            <WorkshopListingNewSlotModal
              workshop={workshop}
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={addNewSlot}
            />
          </Show>
        </Box>
        <Tabs variant={"line"} colorScheme={"gray.400"} defaultIndex={1}>
          <TabList>
            <Tab color={"gray"} fontStyle={"italic"}
                _selected={{fontWeight:"bold", color:"black", 
                            borderBottomColor:"gray.400 !important",
                            fontStyle:"normal", borderBottom:"4px"}}>
                Past sessions
            </Tab>
            <Tab color={"gray"} fontStyle={"italic"}
                _selected={{fontWeight:"bold", color:"black", 
                            borderBottomColor:"gray.400 !important",
                            fontStyle:"normal", borderBottom:"4px"}}>
                Upcoming sessions
            </Tab>
          </TabList>
          <TabPanels>
              <TabPanel>
                <WorkshopListingPastSlotList
                slots={pastSlots}
                bookings={bookings}
                />    
              </TabPanel>
              <TabPanel>
                <WorkshopListingUpcomingSlotList
                workshop={workshop}
                slots={futureSlots}
                bookings={bookings}
                user={user}
                />    
              </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      )}
      <WorkshopListingShare workshop={workshop} />
    </Stack>
  );
}
