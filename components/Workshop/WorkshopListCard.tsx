import { Box, Img, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Workshop } from "../../shared/schemas";

export default function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const router = useRouter();

  return (
    <Box
      cursor={"pointer"}
      borderBottom="1px"
      borderBottomColor={"gray.300"}
      bg="white"
      onClick={() => router.push(`/workshops/${workshop.id}`)}
      py={{ base: "2", md: "4" }}
      width={{ base: "full", sm: "600px" }}
    >
      <Box display="flex" flexDirection={{ base: "row-reverse", sm: "row" }}>
        <Box width={{ base: "200px" }}>
          <Img
            src="https://secure-content.meetupstatic.com/images/classic-events/507108638/444x250.webp"
            rounded={"lg"}
          />
        </Box>
        <Box
          display={"flex"}
          flexDir="column"
          justifyContent={"space-between"}
          width={"100%"}
          pr={{ base: "5", sm: "0" }}
          pl={{ base: "0", sm: "5" }}
        >
          <Box fontSize={{ base: "xs", sm: "sm" }}>
            <Text
              bgGradient="linear(to-r, teal.500, teal.100)"
              bgClip="text"
              pb="0.5"
            >
              {workshop.category}
            </Text>
            <Text fontWeight="semibold" noOfLines={1} fontSize={"16px"}>
              {workshop.name}
            </Text>
            <Text color={"gray.400"} fontSize={"14px"} noOfLines={1} pb="0.5">
              {workshop.virtual
                ? "Online session"
                : `${workshop.house}, ${workshop.street}, ${workshop.postcode}`}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
