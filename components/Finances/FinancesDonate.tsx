"use client";

import {
  Box,
  Button,
  HStack,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";


export default function FinancesDonate({
  donationLink,
  suggestedDonationLinks,
}: {
  donationLink: string;
  suggestedDonationLinks: { label: string; href: string }[];
}) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={5}
      borderColor="gray.200"
      bg="white"
    >
      <Stack spacing={3}>
        <Heading size="md">Quick donate</Heading>
        <Text color="gray.700">
          Choose a suggested amount or pick your own on the donation page.
        </Text>
        <HStack spacing={3} flexWrap="wrap">
          {suggestedDonationLinks.map((link) => (
            <Button
              key={link.label}
              as={Link}
              href={link.href}
              target="_blank"
              colorScheme="blue"
              variant="outline"
              w={{ base: "full", sm: "auto" }}
            >
              {link.label}
            </Button>
          ))}
          <Button
            as={Link}
            href={donationLink}
            target="_blank"
            variant="solid"
            colorScheme="blue"
            w={{ base: "full", sm: "auto" }}
          >
            Other amount
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}
