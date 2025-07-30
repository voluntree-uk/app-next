"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { HiUserGroup, HiOutlineStar, HiOutlineMail } from "react-icons/hi";
import { SiRuby } from "react-icons/si";
import { clientData } from "@data/supabase";
import { Profile } from "@schemas";
import AccountAvatar from "@components/Profile/AccountAvatar";
import { dateToReadable } from "@util/dates";
import { MdSettings } from "react-icons/md";
import Show from "@components/Helpers/Show";
import { UserProfileSettingsModal } from "@components/Profile/UserProfileSettingsModal";

interface IProps {
  profile: Profile;
  isMe: boolean;
}

export default function UserProfile({ profile, isMe }: IProps) {
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const {
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const avatar_url: string = watch("avatar_url");
  const full_name: string | undefined = profile.share_full_name_consent
    ? `${profile.name} ${profile.surname}`
    : profile.name;

  async function updateAvatar({ avatar_url }: any) {
    try {
      setLoading(true);

      const updates = {
        user_id: profile.user_id,
        email: profile.email,
        avatar_url: avatar_url,
      };

      await clientData.updateProfile(updates);
    } catch (error: any) {
      console.error(`Error updating profile: ${error.message}`);
      toast({
        title: "Failed to update profile",
        description: "Please try again later",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateVisibilitySettings(profile: Profile) {
    try {
      setLoading(true);

      const updates = {
        user_id: profile.user_id,
        email: profile.email,
        share_full_name_consent: profile.share_full_name_consent,
        share_email_consent: profile.share_email_consent,
      };

      await clientData.updateProfile(updates);
    } catch (error: any) {
      console.error(`Error updating profile: ${error.message}`);
      toast({
        title: "Failed to update profile",
        description: "Please try again later",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  function roundNumber(
    number: number | undefined,
    decimals: number = 0
  ): string {
    return number !== undefined ? number.toFixed(decimals) : "";
  }

  useEffect(() => {
    setValue("avatar_url", profile.avatar_url);
  }, [profile]);

  return (
    <Container maxW="100%">
      <Box>
        <Flex
          pt={5}
          pb={3}
          bg="white"
          flexDir={{
            base: "column",
            md: "row",
          }}
          gap={5}
          justify={{ md: "space-between" }}
          alignItems={{ md: "stretch" }}
        >
          <AccountAvatar
            url={avatar_url}
            isMe={isMe}
            onUpload={(url: any) => {
              setValue("avatar_url", url);
              updateAvatar({ avatar_url: url });
            }}
          />
          <Flex
            minWidth={"40%"}
            flexDirection={"column"}
            justifyContent="center"
            ml={1}
            alignItems={{
              base: "center",
              md: "start",
            }}
            textAlign={{
              base: "center",
              md: "start",
            }}
          >
            <Heading size={"md"}>
              {full_name} (@{profile.username})
            </Heading>
            <Text size={"md"}>
              Member since{" "}
              {profile.created_at
                ? dateToReadable(profile.created_at.toString(), false)
                : null}
            </Text>
            <Show showIf={profile.share_email_consent == true}>
              <HStack spacing={2}>
                <HiOutlineMail />
                <Text size={"sm"} color={"gray.600"}>
                  {profile.email}
                </Text>
              </HStack>
            </Show>
            <HStack spacing={2}>
              <HiUserGroup />
              <Text size={"sm"} color={"gray.600"}>
                Hosted {profile.hosted_workshops}{" "}
                {profile.hosted_workshops == 1 ? "Workshop" : "Workshops"}
              </Text>
            </HStack>
            <Show showIf={isMe}>
              <Button
                width={{ base: "8em" }}
                size={"sm"}
                variant="outline"
                colorScheme="linkedin"
                leftIcon={<MdSettings />}
                onClick={onOpen}
                my="3"
              >
                Settings
              </Button>
              <UserProfileSettingsModal
                profile={profile}
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={updateVisibilitySettings}
              />
            </Show>
          </Flex>
          <StatGroup
            alignContent={"center"}
            minWidth={"40%"}
            alignItems={"end"}
          >
            <Stat textAlign={{ base: "center", md: "end" }} alignItems={"end"}>
              <HStack justifyContent={{ base: "center", md: "end" }}>
                <SiRuby color="red" />
                <StatLabel>Plenties Awarded</StatLabel>
              </HStack>
              <StatNumber>{roundNumber(profile.award_points)}</StatNumber>
            </Stat>
            <Stat textAlign={{ base: "center", md: "end" }} alignItems={"end"}>
              <HStack justifyContent={{ base: "center", md: "end" }}>
                <HiOutlineStar color="#ffd700" />
                <StatLabel>Volunteer Rating</StatLabel>
              </HStack>
              <StatNumber>
                {roundNumber(profile.rating, 1)} ({profile.reviews_received})
              </StatNumber>
            </Stat>
          </StatGroup>
        </Flex>
      </Box>
    </Container>
  );
}
