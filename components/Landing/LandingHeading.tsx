"use client";

import { Flex, Box, Heading, Img, Text } from "@chakra-ui/react";

export default function LandingHeading() {
  return (
    <Flex
      flexDir={{ base: "column", md: "row" }}
      justifyContent={"space-around"}
      alignItems="center"
    >
      <Box w={{ base: "100%", lg: "550px" }}>
        <Heading
          fontWeight={"extrabold"}
          fontSize={{ base: "2xl", sm: "5xl" }}
          lineHeight={{ base: "35px", sm: "50px" }}
          pb={{ base: "5", sm: "5" }}
        >
          Voluntree is a skill and knowledge sharing platform with a difference.
        </Heading>
        <Text fontSize={"md"} pb={{ base: "5", sm: "0" }}>
          Totally <b>transparent</b> and <b>free</b> to use, Voluntree will
          enable you to help your community, build your reputation and learn
          some brand new skills! Built on a commitment to the idea that social
          exchange has real material value, Voluntree is a social experiment
          platform designed to challenge the conventions of business.
        </Text>
      </Box>
      <Img
        mt={{ base: "8", sm: "0" }}
        height={{ base: "15em", lg: "22em" }}
        src={`${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/meeting.jpg`}
      ></Img>
    </Flex>
  );
}
