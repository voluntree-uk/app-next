import { CalendarIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Img,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Slot, Workshop } from "../../shared/schemas";
import { dateToReadable } from "../../utils/dates";
import { supabase } from "../../utils/supabaseClient";

export default function WorkshopListing({
  workshop,
  slots,
}: {
  workshop: Workshop;
  slots: Slot[];
}) {
  const [loaded, setLoaded] = useState(false);

  const [slotSelected, setSlotSelected] = useState<Slot>(slots[0]);

  return (
    <Layout>
      <Box>
        <Skeleton isLoaded={loaded}>
          <Img
            alt=""
            onLoad={() => setLoaded(true)}
            src="https://www.namecoinnews.com/wp-content/uploads/2021/03/Basic-Forex-Trading-Styles.jpg"
          />
        </Skeleton>

        <Flex
          py={4}
          px={4}
          borderTopWidth={1}
          bg="white"
          alignItems="center"
          mx={2}
          my={1}
          color="gray.700"
          borderLeftWidth={5}
          borderBottomWidth={5}
          borderLeftColor={"brand.700"}
        >
          <Heading
            fontSize={"17px"}
            fontWeight={"semibold"}
            bgGradient="linear(to-r, red.500, yellow.500)"
            bgClip="text"
          >
            {workshop.name}
          </Heading>
        </Flex>

        <Box px={4} pt={4} bg="white" mx={2}>
          <Flex alignItems={"center"}>
            <Img
              src="https://bit.ly/dan-abramov"
              h="50"
              w="50"
              borderRadius={"100%"}
              alt=""
              mr={3}
            />
            <Flex flexDirection={"column"}>
              <Heading
                fontSize={"sm"}
                fontWeight={"semibold"}
                letterSpacing="wide"
              >
                {"Organiser"}
              </Heading>
              <Text fontSize={"sm"} color={"gray.600"}>
                {workshop.user_id}
              </Text>
            </Flex>
          </Flex>
          <Divider pt={3} />
        </Box>

        <Box px={4} py={4} bg="white" mx={2}>
          <Flex alignItems={"center"}>
            <Img
              src={"/map.svg"}
              h="50"
              w="50"
              borderRadius={"100%"}
              alt=""
              mr={3}
            />
            <Flex flexDirection={"column"}>
              <Heading
                fontSize={"sm"}
                fontWeight={"semibold"}
                letterSpacing="wide"
              >
                {"Location"}
              </Heading>
              <Text fontSize={"sm"} color={"gray.600"}>
                {workshop.virtual ? "Virtual" : workshop.street}
              </Text>
            </Flex>
          </Flex>
          <Divider pt={3} />
        </Box>

        <Box bg="white" mx={2} px={4} pb={4}>
          <Text fontSize={"sm"} fontWeight={"normal"}>
            {workshop.description}
          </Text>
        </Box>

        <Box bg="white" mx={2} mt={1}>
          {slots.map((s, i) => (
            <Flex
              key={i}
              px={3}
              mb={0.5}
              py={2}
              justifyContent="space-between"
              alignItems={"center"}
              cursor={"pointer"}
              onClick={() => setSlotSelected(s)}
            >
              <Flex flexDirection="column">
                <Text fontSize={"sm"} fontWeight="medium">
                  {dateToReadable(s.date)}
                </Text>
                <Text fontSize={"sm"} fontWeight="normal" color="gray.500">
                  {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                </Text>
              </Flex>
              <Box>
                <Badge variant={"subtle"} colorScheme="green">
                  {s.capacity} spaces
                </Badge>
              </Box>
            </Flex>
          ))}
        </Box>

        <Box
          borderTopColor={"gray.200"}
          borderTopWidth={"thin"}
          p={3}
          pos="fixed"
          bottom={"0%"}
          w="100%"
          bg="white"
        >
          <Flex justifyContent={"space-between"} alignItems="center">
            <Flex flexDir={"column"} p={2}>
              <Text fontWeight={"normal"} fontSize="sm">
                {dateToReadable(slotSelected.date)}
              </Text>
              <Text fontWeight={"normal"} fontSize="sm" color="gray.500">
                {slotSelected.start_time.slice(0, 5)} -{" "}
                {slotSelected.end_time.slice(0, 5)}
              </Text>
            </Flex>
            <Button
              color={"white"}
              variant="contained"
              bg="brand.700"
              _hover={{ backgroundColor: "#6b66f3ef" }}
              boxShadow="lg"
              w={"30%"}
            >
              Join
            </Button>
          </Flex>
        </Box>
      </Box>
    </Layout>
  );
}
export async function getServerSideProps(context: any) {
  const id = context.query.wid;

  let { data, error } = await supabase
    .from("workshops")
    .select("*")
    .eq("id", id);

  if (error) {
    return { props: {}, redirect: { destination: "/workshops" } };
  }

  if (!data) {
    return { props: {}, redirect: { destination: "/workshops" } };
  }

  let { data: slotsData } = await supabase
    .from("slots")
    .select("*")
    .eq("workshop_id", data[0].id);

  const workshop = data[0];
  const slots = slotsData;

  return { props: { workshop, slots } };
}
