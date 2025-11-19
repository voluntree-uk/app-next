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

export default function TransactionsDonate({
  donationLink,
  suggestedDonationLinks,
}: {
  donationLink: string;
  suggestedDonationLinks: { label: string; href: string }[];
}) {
  return (
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={5}
      bg="white"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        spacing={3}
      >
        <Stack spacing={1}>
          <Heading size="md">Support Voluntree</Heading>
          <Text color="gray.700">
            Your support keeps workshops running and the platform free for
            everyone.
          </Text>
        </Stack>
        <HStack spacing={3} flexWrap="wrap">
          {suggestedDonationLinks.map((link) => (
            <Button
              key={link.label}
              as={Link}
              href={link.href}
              target="_blank"
              colorScheme="blue"
              variant="outline"
              size={{ base: "sm", md: "md" }}
            >
              {link.label}
            </Button>
          ))}
          <Button
            as={Link}
            href={donationLink}
            target="_blank"
            colorScheme="blue"
            size={{ base: "sm", md: "md" }}
          >
            Other
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}
