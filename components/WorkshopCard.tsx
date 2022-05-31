import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Img,
  MenuIcon,
  Skeleton,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiLaptop, BiMenu } from "react-icons/bi";
import { Workshop } from "../shared/schemas";

export default function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const router = useRouter();

  return (
    <Box
      cursor={"pointer"}
      onClick={() => router.push(`/workshops/${workshop.id}`)}
      boxShadow="sm"
    >
      <Img
        alt=""
        src="https://www.namecoinnews.com/wp-content/uploads/2021/03/Basic-Forex-Trading-Styles.jpg"
      />

      <Box borderTopWidth={1} borderTopColor={"gray.100"} bg="white">
        <Heading
          color={"gray.700"}
          size={"md"}
          fontWeight="semibold"
          py={4}
          px={4}
        >
          {workshop.name}
        </Heading>

        <Divider />

        <Text color={"gray.500"} fontSize="sm" py={3} px={4} pb={4}>
          {workshop.description.trim().slice(0, 90)}...
        </Text>
        <Flex px={4} pb={4}>
          <Tag
            mr={1}
            display="flex"
            alignItems={"center"}
            colorScheme="cyan"
            boxShadow="sm"
          >
            <BiMenu style={{ marginRight: "5px" }} />
            {workshop.category}
          </Tag>
          {workshop.virtual ? (
            <Tag display="flex" alignItems={"center"} boxShadow="sm">
              <BiLaptop style={{ marginRight: "5px" }} /> virtual session
            </Tag>
          ) : null}
        </Flex>
      </Box>
    </Box>
  );
}
