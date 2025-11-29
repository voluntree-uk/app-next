"use client";

import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Container,
  Button,
} from "@chakra-ui/react";
import { Profile } from "@schemas";
import AccountAvatar from "@components/Profile/AccountAvatar";
import { dateToReadable } from "@util/dates";
import { HiOutlineMail, HiOutlineStar } from "react-icons/hi";
import { MdSettings } from "react-icons/md";

interface IProps {
  profile: Profile;
  isMe: boolean;
  onAvatarUpload: (url: string) => void;
  avatarUrl: string | null;
  onSettingsClick: () => void;
}

export default function ProfileHero({
  profile,
  isMe,
  onAvatarUpload,
  avatarUrl,
  onSettingsClick,
}: IProps) {
  const full_name = profile.share_full_name_consent
    ? `${profile.name} ${profile.surname}`
    : profile.name;

  return (
    <Box bg="white">
      <Container maxW="7xl" px={{ base: 6, md: 10 }} py={{ base: 10, md: 14 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 8, md: 12 }}
          align="center"
          justify="center"
        >
          {/* Avatar Section with enhanced styling and upload button */}
          <AccountAvatar
            url={avatarUrl || ""}
            isMe={isMe}
            onUpload={onAvatarUpload}
          />
          {/* Name and Info Section - More prominent */}
          <VStack
            spacing={5}
            maxW={{ base: "100%", md: "600px" }}
            textAlign="center"
            justify="center"
          >
            <VStack spacing={3} width="100%">
              <Heading size="2xl" color="gray.900" fontWeight="extrabold">
                {full_name}
              </Heading>

              <HStack spacing={4} flexWrap="wrap">
                <Text fontSize="xl" color="blue.600" fontWeight="bold">
                  @{profile.username}
                </Text>

                {profile.rating && profile.rating > 0 && (
                  <HStack
                    spacing={1}
                    color="yellow.500"
                    bg="yellow.50"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    <HiOutlineStar size={18} />
                    <Text fontSize="md" fontWeight="bold" color="gray.800">
                      {profile.rating.toFixed(1)}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      ({profile.reviews_received || 0})
                    </Text>
                  </HStack>
                )}
              </HStack>
            </VStack>

            {/* Additional Info Cards */}
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Badge
                colorScheme="blue"
                px={4}
                py={2}
                borderRadius="lg"
                fontSize="sm"
                fontWeight="medium"
                variant="subtle"
              >
                Member since{" "}
                {profile.created_at
                  ? dateToReadable(
                      profile.created_at.toString().split("T")[0],
                      "00:00:00",
                      false
                    )
                  : "recently"}
              </Badge>
              {profile.share_email_consent && (
                <HStack
                  spacing={2}
                  color="gray.700"
                  bg="gray.100"
                  px={4}
                  py={2}
                  borderRadius="lg"
                >
                  <HiOutlineMail size={16} />
                  <Text fontSize="sm" fontWeight="medium">{profile.email}</Text>
                </HStack>
              )}
            </HStack>

            {/* Settings button for own profile - More prominent */}
            {isMe && (
              <Button
                size="md"
                variant="outline"
                colorScheme="blue"
                leftIcon={<MdSettings />}
                onClick={onSettingsClick}
                borderRadius="lg"
                borderWidth="1px"
                _hover={{
                  bg: "blue.50",
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                }}
                transition="all 0.2s"
              >
                Settings
              </Button>
            )}
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
}

