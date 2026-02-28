"use client";

import React from "react";
import { BsCameraVideo, BsPinMap } from "react-icons/bs";
import { Box, Flex, Text, Container, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { Workshop } from "@schemas";
import { workshopToReadableAddress } from "@util/addresses";

interface IProps {
  workshop: Workshop;
}

function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function WorkshopListingLocation({ workshop }: IProps) {
  const addressLine = workshop.virtual ? null : workshopToReadableAddress(workshop);
  const mapsUrl = addressLine ? googleMapsSearchUrl(addressLine) : null;

  return (
    <Box bg="gray.50" borderBottomWidth="1px" borderBottomColor="gray.200">
      <Container maxW="7xl" px={{ base: 6, md: 10 }} py={4}>
        <Flex alignItems="center" gap={3}>
          <Box fontSize="xl" color={workshop.virtual ? "purple.500" : "blue.500"}>
            {workshop.virtual ? <BsCameraVideo /> : <BsPinMap />}
          </Box>
          <Box>
            <Text fontWeight="semibold" color="gray.700" fontSize="md">
              {workshop.virtual
                ? "Online Event"
                : addressLine}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {workshop.virtual ? (
                "Join link will be shared with attendees"
              ) : mapsUrl ? (
                <Link
                  as={NextLink}
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue.600"
                  _hover={{ textDecoration: "underline" }}
                >
                  Open map
                </Link>
              ) : (
                "In-person"
              )}
            </Text>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
