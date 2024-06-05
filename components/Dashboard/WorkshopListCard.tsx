import NextLink from "next/link";
import { EditIcon } from "@chakra-ui/icons";
import { Flex, useToast, Link, Avatar, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Workshop } from "@schemas";

interface IProps {
  workshop: Workshop;
}
export default function WorkshopListCard({ workshop }: IProps) {
  const router = useRouter();

  const directToWorkshop = (workshop: Workshop) => {
    router.push(`/workshops/${workshop.id}`);
  };

  const toast = useToast();

  const [loading, setLoading] = useState(false);

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
        <Avatar
          src="https://static.vecteezy.com/system/resources/previews/003/452/135/original/man-riding-bicycle-sport-illustration-vector.jpg"
          size={"lg"}
          mr="3"
          cursor={"pointer"}
        ></Avatar>
        <Flex alignItems={"center"} justifyContent="space-between" w={"100%"}>
          <Flex flexDir={"column"} w={"100%"}>
            <Link
              as={NextLink}
              href={`/workshops/${workshop.id}`}
              fontWeight={"bold"}
              mb="0.5"
            >
              {workshop.name}
            </Link>
          </Flex>
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
