"use client";

import NextLink from "next/link";
import { EditIcon } from "@chakra-ui/icons";
import { Flex, Link, Text, Button, VStack, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Slot, Workshop } from "@schemas";
import { MdEventAvailable } from "react-icons/md";
import { BiSolidWebcam } from "react-icons/bi";
import { clientData } from "@data/supabase";
import { isBeforeNow } from "@util/dates";

interface IProps {
  workshop: Workshop;
}
export default function WorkshopListCard({ workshop }: IProps) {
  const router = useRouter();

  const directToWorkshop = (workshop: Workshop) => {
    router.push(`/workshops/${workshop.id}`);
  };
  const [slots, setSlots] = useState<Slot[] | null>(null);

  useEffect(() => {
    clientData.getWorkshopSlots(workshop.id!).then((slots) => {
      setSlots(slots.filter((slot) => !isBeforeNow(new Date(slot.date))))
    })
  })

  return (
    <Flex
      px="5"
      py="3"
      justifyContent="space-between"
      // alignItems={"center"}
      display="flex"
      borderBottomWidth="1px"
      borderBottomColor={"gray.300"}
      _hover={{
        background: "gray.50",
      }}
      onClick={() => directToWorkshop(workshop)}
    >
      <Flex w={"100%"}>
        <Flex alignItems={"center"} justifyContent="space-between" w={"100%"}>
          <VStack w={"70%"} alignItems={"start"} spacing="0">
            <Link
              as={NextLink}
              href={`/workshops/${workshop.id}`}
              fontWeight={"bold"}
              mb="0.5"
            >
              {workshop.name}
            </Link>
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
            onClick={() => directToWorkshop(workshop)}
          >
            Manage
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
