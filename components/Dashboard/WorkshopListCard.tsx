"use client";

import { EditIcon } from "@chakra-ui/icons";
import { Flex, Text, Button, VStack, Icon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Slot, Workshop } from "@schemas";
import { MdEventAvailable } from "react-icons/md";
import { BiSolidWebcam } from "react-icons/bi";
import { clientData } from "@data/supabase";
import { isBeforeNow } from "@util/dates";

interface IProps {
  workshop: Workshop;
  navigate: (id: string) => void;
}
export default function WorkshopListCard({ workshop, navigate }: IProps) {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    clientData.getWorkshopSlots(workshop.id!).then((slots) => {
      setSlots(slots.filter((slot) => !isBeforeNow(new Date(`${slot.date}T${slot.end_time}`))))
    }).catch((err) => {
      setSlots([])
    })
  }, [])

  return (
    <Flex
      cursor={"pointer"}
      px="5"
      py="3"
      justifyContent="space-between"
      display="flex"
      borderBottomWidth="1px"
      borderBottomColor={"gray.300"}
      _hover={{
        background: "gray.50",
      }}
      onClick={() => navigate(workshop.id!)}
    >
      <Flex alignItems={"center"} justifyContent="space-between" w={"100%"}>
        <VStack w={"70%"} alignItems={"start"} spacing="0">
          <Text fontWeight={"bold"} mb="0.5">
            {workshop.name}
          </Text>
          <Text
            color="gray.500"
            display={"flex"}
            alignItems="center"
            fontSize="small"
            mb="0.5"
          >
            <Icon boxSize={"1.3em"} as={BiSolidWebcam} mr="2" />
            {`Online Event`}
          </Text>
          <Text
            color="gray.500"
            display={"flex"}
            alignItems="center"
            fontSize="small"
            mb="0.5"
          >
            <Icon boxSize={"1.3em"} as={MdEventAvailable} mr="2" />
            {`${slots?.length} upcoming date${slots?.length == 1 ? "" : "s"}`}
          </Text>
        </VStack>
        <Button
          rounded="full"
          rightIcon={<EditIcon />}
          colorScheme="linkedin"
          size={{ base: "sm", sm: "md" }}
          variant="solid"
          onClick={() => navigate(workshop.id!)}
        >
          Manage
        </Button>
      </Flex>
    </Flex>
  );
}
