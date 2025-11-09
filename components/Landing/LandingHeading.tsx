"use client";

import { Flex, Box, Heading, Img, Text, Button, Stack } from "@chakra-ui/react";
import NextLink from "next/link";

export default function LandingHeading() {
  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      justifyContent={"space-between"}
      alignItems="center"
    >
      <Box w={{ base: "100%", lg: "550px" }}>
        <Heading
          fontWeight={"extrabold"}
          fontSize={{ base: "2xl", sm: "5xl" }}
          lineHeight={{ base: "35px", sm: "50px" }}
          pb={{ base: "4", sm: "5" }}
        >
          Learn new skills for free from your community.
        </Heading>
        <Text fontSize={{ base: "md", sm: "lg" }} color="gray.600" pb={{ base: "5", sm: "6" }} textAlign={"justify"}>
          Browse community-led workshops, book a session that fits your schedule, and connect with volunteers who love to teach. Ready to share what you know? Create your own workshop in minutes and inspire others.
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
          <Button as={NextLink} href="/workshops" colorScheme="blue" size={{ base: "md", sm: "lg" }}>
            Browse workshops
          </Button>
          <Button as={NextLink} href="/workshops/new" variant="outline" colorScheme="blue" size={{ base: "md", sm: "lg" }}>
            Host a workshop
          </Button>
        </Stack>
      </Box>
      <Img
        mt={{ base: "8", sm: "0" }}
        height={{ base: "15em", lg: "22em" }}
        src={`${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/meeting.jpg`}
      ></Img>
    </Flex>
  );
}
