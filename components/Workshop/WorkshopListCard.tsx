import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Img, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Workshop } from "../../shared/schemas";

export default function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const router = useRouter();

  return (
    <Box
      cursor={"pointer"}
      borderTop="1px"
      borderTopColor={"gray.300"}
      bg="white"
      onClick={() => router.push(`/workshops/${workshop.id}`)}
      py={{ base: "2", md: "4" }}
    >
      <Box display="flex">
        <Img
          src="https://secure-content.meetupstatic.com/images/classic-events/506990077/444x250.webp"
          rounded={"lg"}
          mr="4"
          height={{ base: "40px", md: "90px" }}
        />
        <Box
          display={"flex"}
          flexDir="column"
          justifyContent={"space-between"}
          width={"100%"}
        >
          <Box>
            <Text
              fontSize={"14px"}
              fontWeight="bold"
              color={"green.400"}
              textTransform="uppercase"
            >
              {workshop.category}
            </Text>
            <Text fontSize={"16px"} fontWeight="bold" noOfLines={1}>
              {workshop.name}
            </Text>
            <Text color={"gray.600"} fontSize={"14px"} noOfLines={1}>
              {workshop.description}
            </Text>
          </Box>
          <Box
            justifyContent="space-between"
            pr={10}
            color={"gray.500"}
            display={{ base: "none", md: "flex" }}
          >
            <Text fontSize={"14px"} fontWeight="medium">
              4 spaces available
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
