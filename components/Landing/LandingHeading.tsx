"use client";

import { Flex, Box, Heading, Img, Text, Button, Stack, HStack, Badge } from "@chakra-ui/react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { BiMap, BiVideo } from "react-icons/bi";

const MotionFlex = motion(Flex);

export default function LandingHeading() {
  return (
    <MotionFlex
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      flexDir={{ base: "column", lg: "row" }}
      justifyContent={"space-between"}
      alignItems="center"
    >
      <Box w={{ base: "100%", lg: "550px" }}>
        <HStack
          display={{ base: "none", lg: "flex" }}
          spacing={3}
          mb={{ base: "3", sm: "4" }}
          flexWrap="wrap"
        >
          <Badge colorScheme="blue" px={2} py={1} borderRadius="md" fontSize="sm">
            <HStack spacing={1}>
              <BiMap />
              <span>In-person</span>
            </HStack>
          </Badge>
          <Badge colorScheme="purple" px={2} py={1} borderRadius="md" fontSize="sm">
            <HStack spacing={1}>
              <BiVideo />
              <span>Online</span>
            </HStack>
          </Badge>
        </HStack>
        <Heading
          fontWeight={"extrabold"}
          fontSize={{ base: "2xl", md: "3xl", lg: "5xl" }}
          lineHeight={{ base: "35px", sm: "50px" }}
          pb={{ base: "4", sm: "5" }}
        >
          <Box display={{ base: "block", sm: "inline" }}>
            Share Your Passion.
            <br style={{ display: "inline", width: 0, height: 0 }} />
            Build Your Community.
          </Box>
        </Heading>
        <Text fontSize={{ base: "md", sm: "lg" }} color="gray.600" pb={{ base: "5", sm: "6" }} textAlign={"justify"}>
          Everyone has something valuable to offer. Voluntree connects you with people eager to learn your skills and share their own. Start connecting online or meet up with your neighbors to make a real impact.
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
          <Button as={NextLink} href="/workshops" colorScheme="blue" size={{ base: "md", sm: "lg" }}>
            Find Your Community
          </Button>
          <Button as={NextLink} href="/workshops/new" variant="outline" colorScheme="blue" size={{ base: "md", sm: "lg" }}>
            Offer Your Skills
          </Button>
        </Stack>
      </Box>
      <Img
        mt={{ base: "8", sm: "0" }}
        height={{ base: "15em", lg: "22em" }}
        src={`${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/meeting.jpg`}
        alt="Community meetup"
        borderRadius="lg"
      />
    </MotionFlex>
  );
}
