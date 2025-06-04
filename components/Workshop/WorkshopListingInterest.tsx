"use client";

import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { Workshop, User, WorkshopInterest } from "@schemas";
import { useRouter } from "next/navigation";
import { clientData } from "@data/supabase";
import { FaBell } from "react-icons/fa";
import { FaCheckSquare  } from "react-icons/fa";
import { ConfirmActionDialog } from "@components/Helpers/ConfirmActionDialog";

interface IProps {
  workshop: Workshop;
  user: User | null;
  isUserInterested: boolean;
  numberOfInterestedUsers: number;
}

export default function WorkshopListingDescription({
  workshop,
  user,
  isUserInterested,
  numberOfInterestedUsers,
}: IProps) {
  const isUserHost = () => user?.id == workshop.user_id;
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const interestedUsersCountText: string =
    numberOfInterestedUsers == 1
      ? `1 user expressed interest.`
      : `${numberOfInterestedUsers} users expressed interest.`;

  async function expressInterest(): Promise<void> {
    try {
      if (!user) {
        router.push("/login");
        return;
      }
      if (workshop.id) {
        const interest: WorkshopInterest = {
          workshop_id: workshop.id,
          user_id: user.id,
        };
        const success = await clientData.expressInterestInWorkshop(interest);

        if (success) {
          toast({
            title: "You have expressed interest",
            description:
              "Thank you for your interest in this workshop. The host will be notified.",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          onClose();
          router.refresh();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Problem expressing interest in this workshop.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  return (
    <Box p="6" rounded="md" px={{ base: "6", md: "16" }}>
      {!isUserHost() &&
        (isUserInterested ? (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            flexDirection="column"
          >
            <Button
              rounded="full"
              colorScheme="green"
              variant="outline"
              rightIcon={<FaCheckSquare />}
              size={{ base: "sm", sm: "md" }}
              m="3"
              isDisabled
            >
              I'm interested
            </Button>
          </Flex>
        ) : (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            flexDirection="column"
          >
            <Button
              rounded="full"
              colorScheme="blue"
              variant="outline"
              onClick={onOpen}
              rightIcon={<FaBell  />}
              size={{ base: "sm", sm: "md" }}
              m="3"
            >
              Show interest
            </Button>
            <ConfirmActionDialog
              title="Show interest"
              message="When you show interest, we notify the host that there's demand. That might inspire them to schedule more sessions."
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={expressInterest} />
          </Flex>
        ))}
      <Text
        whiteSpace={"pre-wrap"}
        color={"gray.600"}
        fontSize={"14px"}
        lineHeight="6"
        w="100%"
        textAlign={"center"}
      >
        {interestedUsersCountText}
      </Text>
    </Box>
  );
}
