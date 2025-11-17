"use client";

import React from "react";
import {
  Box,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";

interface IProps {
  onAddSessionClick: () => void;
}

export default function WorkshopListingCreateSlots({
  onAddSessionClick,
}: IProps) {
  
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
            Add availability slots so community members can book and join your workshop.
          </Text>
        </VStack>
        <VStack spacing={3}>
          <Button
            colorScheme="blue"
            variant="solid"
            onClick={onAddSessionClick}
            rightIcon={<MdAdd />}
            size="md"
            w="full"
            maxW="300px"
          >
            Create New Session
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
