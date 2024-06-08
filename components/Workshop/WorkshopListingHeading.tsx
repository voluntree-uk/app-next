"use client";

import React, { useState } from "react";
import {
  Box,
  Text,
  Link,
  Flex,
  Stack,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { clientData } from "@data/supabase";
import { Profile, User, Workshop } from "@schemas";
import { MdOutlineCancel } from "react-icons/md";
import { useRouter } from "next/navigation";
import Show from "@components/Helpers/Show";
import { ConfirmActionDialog } from "@components/Helpers/ConfirmActionDialog";

interface IProps {
  workshop: Workshop;
  host: Profile;
  user: User | null;
}

export default function WorkshopListingHeading({
  workshop,
  host,
  user,
}: IProps) {
  const router = useRouter();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);

  const isUserHost = () => user?.id == workshop.user_id;

  async function cancelWorkshop(): Promise<void> {
    setLoading(true);

    try {
      if (workshop.id) {
        const success = await clientData.cancelWorkshop(workshop.id);
        // Redirect to dashboard if cancelled successfully
        if (success) {
          toast({
            title: "Success",
            status: "success",
            isClosable: true,
          });
          router.push("/me/dashboard");
        }
      }
    } catch (error) {
      const message = (error as any).message;

      toast({
        title: "Problem canceling the workshop",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      borderBottomWidth={"1px"}
      borderBottomColor="gray.200"
      p="6"
      px={{ base: "4", md: "6" }}
    >
      <Stack spacing={6}>
        <Show showIf={isUserHost()}>
          <Alert rounded={10} status="info">
            <AlertIcon />
            <AlertTitle>Thank you for hosting this workshop!</AlertTitle>
            <AlertDescription>
              Below you can edit the available slots.
            </AlertDescription>
          </Alert>
        </Show>
        <Box
          px={{ base: "2", md: "10" }}
          display="flex"
          justifyContent={"space-between"}
        >
          <Flex alignItems={"center"}>
            <Flex flexDir={"column"}>
              <Text
                pb="1"
                color={"gray.700"}
                fontSize="20px"
                fontWeight="extrabold"
              >
                {workshop.name}
              </Text>

              <Text color="gray.500">
                Hosted by{" "}
                <Link
                  as={NextLink}
                  href={`/user/${host.user_id}`}
                  color={"red.400"}
                >
                  {host.username}
                </Link>
              </Text>
            </Flex>
          </Flex>
          <Show showIf={isUserHost()}>
            <Flex alignItems={"center"}>
              <Button
                rounded="full"
                colorScheme="blackAlpha"
                variant={"outline"}
                onClick={onOpen}
                rightIcon={<MdOutlineCancel />}
                size={{ base: "xs", sm: "md" }}
                mr="3"
              >
                Cancel
              </Button>
            </Flex>
            <ConfirmActionDialog
              title="Cancel Workshop"
              message="Are you sure you want to cancel this workshop? This action cannot be undone."
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={cancelWorkshop}
            />
          </Show>
        </Box>
      </Stack>
    </Box>
  );
}
