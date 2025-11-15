"use client"

import React, { useEffect, useState } from "react";
import { 
  Box, 
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { BookingDetails, Workshop } from "@schemas";
import { User } from "@supabase/supabase-js";
import { clientData } from "@data/supabase";
import Loader from "@components/Loader";
import DashboardTeachingTab from "@components/Dashboard/DashboardTeachingTab";
import DashboardLearningTab from "@components/Dashboard/DashboardLearningTab";

export default function DashboardPage({ user }: { user: User }) {
  const [workshops, setWorkshops] = useState<Workshop[]|null>(null);
  const [bookings, setBookings] = useState<BookingDetails[]|null>(null);
  
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Fetching your workshops and bookings");

  useEffect(() => {
    Promise.all([
      clientData.getUserWorkshops(user.id).catch(() => []),
      clientData.getUserBookings(user.id).catch(() => [])
    ]).then(([workshopsData, bookingsData]) => {
      setWorkshops(workshopsData);
      setBookings(bookingsData);
      setLoading(false);
    });
  }, [user.id]);

  const hasTeachingSessions = (workshops?.length || 0) > 0;
  const defaultIndex = hasTeachingSessions ? 0 : 1;

  return (
    <>
      {loading ? (
        <Loader message={loadingMessage} fullScreen />
      ) : (
        <Box bg="gray.50" minH="100vh" py={{ base: 8, md: 12 }}>
          <Container maxW="7xl" px={{ base: 6, md: 10 }}>
            <Tabs variant="line" colorScheme="blue" defaultIndex={defaultIndex}>
              <TabList borderBottomWidth="2px" borderBottomColor="gray.200" mb={6}>
                <Tab
                  color="gray.600"
                  fontWeight="medium"
                  _selected={{
                    fontWeight: "bold",
                    color: "blue.600",
                    borderBottomColor: "blue.500",
                    borderBottomWidth: "2px",
                  }}
                  px={6}
                  py={3}
                >
                  Teaching
                </Tab>
                <Tab
                  color="gray.600"
                  fontWeight="medium"
                  _selected={{
                    fontWeight: "bold",
                    color: "blue.600",
                    borderBottomColor: "blue.500",
                    borderBottomWidth: "2px",
                  }}
                  px={6}
                  py={3}
                >
                  Learning
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <DashboardTeachingTab workshops={workshops || []} />
                </TabPanel>
                <TabPanel px={0}>
                  <DashboardLearningTab bookings={bookings || []} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </Box>
      )}
    </>
  );
}
