import { Box, Button, Center, Heading, Img, Text } from "@chakra-ui/react";
import React from "react";
import { MdStarOutline } from "react-icons/md";
import HeadingBar from "./HeadingBar";

export default function WorkshopCard() {
  return (
    <Box>
      <Img src="https://www.namecoinnews.com/wp-content/uploads/2021/03/Basic-Forex-Trading-Styles.jpg" />
      <Box borderTopWidth={1} borderTopColor={"gray.100"} p={3} bg="white">
        <Box mb={4}>
          <Heading color={"gray.700"} size={"sm"} fontWeight="semibold" py={2}>
            Forex Trading
          </Heading>
          <Text color={"gray.600"} fontSize="medium">
            Introductory session where all the basics of Forex trading will be
            covered.
          </Text>
        </Box>
        <Button
          color={"gray.600"}
          leftIcon={<MdStarOutline />}
          variant={"outline"}
          w={"100%"}
          borderColor="gray.100"
          fontSize="medium"
        >
          Star
        </Button>
      </Box>
    </Box>
  );
}
