"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, HStack, Img, Text } from "@chakra-ui/react";
import { Workshop } from "@schemas";

interface IProps {
  workshop: Workshop;
  navigate: (workshop: Workshop) => void;
}

export default function WorkshopCard({ workshop, navigate }: IProps) {
  const router = useRouter();
  return (
    <Box
      cursor={"pointer"}
      borderBottom="1px"
      borderBottomColor={"gray.300"}
      bg="white"
      onClick={() => navigate(workshop)}
      py={{ base: "2", md: "4" }}
      px={"1em"}
      _hover={{
        background: "gray.50",
      }}
    >
      <HStack display="flex" spacing="1em">
        <Box alignItems={"center"}>
          <Img
            src={`${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/${workshop.category}_sm.png`}
            rounded={"lg"}
            mr="1em"
            height={"100px"}
            width={"150px"}
          />
        </Box>
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
              bgGradient="linear(to-r, teal.500, green.500)"
              bgClip="text"
            >
              {workshop.category}
            </Text>
            <Text
              fontSize={{ md: "16px", base: "18px" }}
              fontWeight="semibold"
              color="gray.600"
            >
              {workshop.name}
            </Text>
            <Box display={{ md: "inline", base: "none" }}>
              <Text
                color={"gray.600"}
                fontSize={"14px"}
                noOfLines={{ md: 2, base: 1 }}
              >
                {workshop.description}
              </Text>
            </Box>
          </Box>
        </Box>
      </HStack>
    </Box>
  );
}
