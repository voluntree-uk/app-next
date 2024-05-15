import React, { ReactElement, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Text, Link, Flex, Avatar, Stack, Alert, AlertIcon, AlertDescription, AlertTitle, Button, useToast } from "@chakra-ui/react";
import { data } from "@data/supabase";
import { Workshop } from "@schemas";
import { useSession } from "@util/hooks";
import { MdOutlineCancel } from "react-icons/md";
import { useRouter } from "next/router";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingHeading({ workshop }: IProps) {
  const router = useRouter();
  const session = useSession();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const isUserHost = () => session?.user?.id == workshop.user_id

  const ownerProfileQuery = useQuery(["profile"], () =>
    data.getProfile(workshop.user_id)
  );

  async function cancelWorkshop(workshop: Workshop): Promise<void> {
    setLoading(true);

    try {
      if (workshop.id) {
        const success = await data.cancelWorkshop(workshop.id);
        // Redirect to dashboard if cancelled successfully
        if (success) {
          toast({
            title: "Success",
            status: "success",
            isClosable: true
          })
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

  function hostBanner(): ReactElement | null {
    return isUserHost() ? (
      <Alert rounded={10} status="info">
        <AlertIcon />
        <AlertTitle>Thank you for hosting this workshop!</AlertTitle>
        <AlertDescription>
          Below you can edit the available slots.
        </AlertDescription>
      </Alert>
    ) : null;
  }

  function cancelButton(): ReactElement | null {
    return isUserHost() ? (
      <Flex alignItems={"center"}>
        <Button
          rounded="full"
          colorScheme="blackAlpha"
          variant={"outline"}
          onClick={() => cancelWorkshop(workshop)}
          rightIcon={<MdOutlineCancel />}
          size={{ base: "xs", sm: "md" }}
          mr="3"
        >
          Cancel
        </Button>
      </Flex>
    ) : null;
  }

  return (
    <Box
      borderBottomWidth={"1px"}
      borderBottomColor="gray.200"
      p="6"
      px={{ base: "4", md: "6" }}
    >
      <Stack spacing={6}>
        {hostBanner()}
        <Box px={{ base: "2", md: "10" }} display="flex" justifyContent={"space-between"}>
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
                <Link color={"red.400"}>
                  {ownerProfileQuery.data?.username}
                </Link>
              </Text>
            </Flex>
          </Flex>
          {cancelButton()}
        </Box>
      </Stack>
    </Box>
  );
}
