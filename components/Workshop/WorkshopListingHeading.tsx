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
  Container,
  Heading,
  Badge,
  Avatar,
  HStack,
  VStack,
  Img,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { capitalize } from "lodash";
import { BiMap, BiVideo, BiStar } from "react-icons/bi";
import { MdOutlineCancel, MdMoreVert } from "react-icons/md";
import { clientData } from "@data/supabase";
import { Profile, User, Workshop } from "@schemas";
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

  const hostName = host.name || host.username || "Anonymous";
  const hostAvatarUrl = host.avatar_url && host.avatar_url !== "default_avatar.png"
    ? `${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/${host.avatar_url}`
    : undefined;

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
    <Box bg="white" borderBottomWidth="1px" borderBottomColor="gray.200">
      <Container maxW="7xl" px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}>
        <Stack spacing={6}>
          {/* Host Alert */}
          <Show showIf={isUserHost()}>
            <Alert rounded="lg" status="info" variant="left-accent">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Thank you for hosting this workshop!</AlertTitle>
                <AlertDescription>
                  Manage your sessions and connect with learners below.
                </AlertDescription>
              </Box>
            </Alert>
          </Show>

          {/* Hero Section */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 6, lg: 8 }}
            align={{ base: "stretch", lg: "flex-start" }}
          >
            {/* Category Image */}
            <Box
              flexShrink={0}
              alignSelf={{ base: "center", lg: "flex-start" }}
            >
              <Img
                src={`${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/${workshop.category}_sm.png`}
                alt={workshop.category}
                rounded="xl"
                height={{ base: "200px", md: "240px", lg: "280px" }}
                width={{ base: "280px", md: "340px", lg: "400px" }}
                objectFit="cover"
                boxShadow="lg"
              />
            </Box>

            {/* Content */}
            <Box flex="1" minW={0}>
              <Stack spacing={4}>
                {/* Category Badge and Host Actions */}
                <Flex justify="space-between" align="flex-start">
                  <Badge
                    fontSize="sm"
                    fontWeight="bold"
                    bgGradient="linear(to-r, teal.500, green.500)"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    textTransform="uppercase"
                    w="fit-content"
                  >
                    {workshop.category}
                  </Badge>
                  <Show showIf={isUserHost()}>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Workshop options"
                        icon={<MdMoreVert />}
                        variant="ghost"
                        size="sm"
                        color="gray.600"
                        _hover={{ bg: "gray.100" }}
                      />
                      <MenuList>
                        <MenuItem
                          icon={<MdOutlineCancel />}
                          color="red.600"
                          onClick={onOpen}
                        >
                          Cancel Workshop
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <ConfirmActionDialog
                      title="Cancel Workshop"
                      message="Are you sure you want to cancel this workshop? This action cannot be undone."
                      isOpen={isOpen}
                      onClose={onClose}
                      onSubmit={cancelWorkshop}
                    />
                  </Show>
                </Flex>

                {/* Workshop Title */}
                <Heading
                  size={{ base: "xl", md: "2xl" }}
                  fontWeight="bold"
                  color="gray.700"
                  lineHeight="short"
                >
                  {workshop.name}
                </Heading>

                {/* Location Badge */}
                <HStack spacing={2}>
                  <Badge
                    colorScheme={workshop.virtual ? "purple" : "blue"}
                    fontSize="xs"
                    px={3}
                    py={1}
                    borderRadius="md"
                  >
                    <HStack spacing={1}>
                      <Box as={workshop.virtual ? BiVideo : BiMap} />
                      <Text>
                        {workshop.virtual ? "Online" : workshop.city || "In-person"}
                      </Text>
                    </HStack>
                  </Badge>
                </HStack>

                {/* Host Card */}
                <Box
                  bg="gray.50"
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  p={4}
                  mt={2}
                >
                  <HStack spacing={4}>
                    <Avatar
                      size="md"
                      name={hostName}
                      src={hostAvatarUrl}
                    />
                    <VStack align="flex-start" spacing={1} flex="1">
                      <HStack spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          Hosted by
                        </Text>
                        <Link
                          as={NextLink}
                          href={`/user/${host.user_id}`}
                          fontWeight="semibold"
                          color="blue.600"
                          _hover={{ color: "blue.700", textDecoration: "underline" }}
                        >
                          {hostName}
                        </Link>
                      </HStack>
                      {host.rating && host.rating > 0 && (
                        <HStack spacing={1}>
                          <Box as={BiStar} color="yellow.400" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            {host.rating.toFixed(1)}
                          </Text>
                          {host.reviews_received && host.reviews_received > 0 && (
                            <Text fontSize="sm" color="gray.500">
                              ({host.reviews_received} {host.reviews_received === 1 ? "review" : "reviews"})
                            </Text>
                          )}
                        </HStack>
                      )}
                    </VStack>
                  </HStack>
                </Box>
              </Stack>
            </Box>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}
