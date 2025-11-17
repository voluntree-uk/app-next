"use client";

import React from "react";
import {
  Box,
  Text,
  Button,
  useToast,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { Workshop, User, WorkshopInterest } from "@schemas";
import { useRouter } from "next/navigation";
import { clientData } from "@data/supabase";
import { FaBell, FaCheckSquare } from "react-icons/fa";

interface IProps {
  workshop: Workshop;
  user: User | null;
  isUserInterested: boolean;
  numberOfInterestedUsers: number;
}

export default function WorkshopListingInterest({
  workshop,
  user,
  isUserInterested,
  numberOfInterestedUsers,
}: IProps) {
  const toast = useToast();
  const router = useRouter();

  async function expressInterest(): Promise<void> {
    try {
      if (!user) {
        router.push("/login");
        return;
      }
      if (workshop.id) {
        const interest: WorkshopInterest = {
          workshop_id: workshop.id,
          user_id: user.id,
        };
        const success = await clientData.expressInterestInWorkshop(interest, workshop);

        if (success) {
          router.refresh();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Problem expressing interest in this workshop.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  return (
    <Box
      bg="blue.50"
      borderWidth="2px"
      borderColor="blue.200"
      borderRadius="xl"
      p={6}
      mt={4}
    >
      <VStack spacing={4} align="stretch">
        <VStack spacing={2} align="center">
          <Text fontSize="lg" fontWeight="semibold" color="blue.900" textAlign="center">
            No upcoming sessions scheduled
          </Text>
          <Text fontSize="sm" color="blue.700" textAlign="center">
            Show your interest and we'll notify the host. This helps them see there's demand and may inspire them to schedule more sessions!
          </Text>
        </VStack>

        {isUserInterested ? (
          <VStack spacing={3}>
            <Button
              colorScheme="green"
              variant="solid"
              rightIcon={<FaCheckSquare />}
              size="md"
              isDisabled
              w="full"
              maxW="300px"
            >
              You're Interested
            </Button>
          </VStack>
        ) : (
          <VStack spacing={3}>
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={expressInterest}
              rightIcon={<FaBell />}
              size="md"
              w="full"
              maxW="300px"
            >
              Show Interest
            </Button>
          </VStack>
        )}

        {numberOfInterestedUsers > 0 && (
          <HStack justify="center" spacing={2} pt={2}>
            <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
              {numberOfInterestedUsers} {numberOfInterestedUsers === 1 ? "person" : "people"} interested
            </Badge>
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
