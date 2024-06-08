"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Container, Flex, Heading, HStack, Stat, StatGroup, StatLabel, StatNumber, Text } from "@chakra-ui/react";
import { HiUserGroup, HiOutlineStar } from "react-icons/hi";
import { SiRuby } from "react-icons/si";
import { clientData } from "@data/supabase";
import { Profile } from "@schemas";
import AccountAvatar from "@components/Profile/AccountAvatar";
import { dateToReadable } from "@util/dates";

interface IProps {
  profile: Profile;
  isMe: boolean;
}

export default function UserProfile({ profile, isMe }: IProps) {
  const [loading, setLoading] = useState(true);

  const {
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const avatar_url: string = watch("avatar_url");

  async function updateProfile({ avatar_url }: any) {
    try {
      setLoading(true);
      
      const updates = {
        user_id: profile.user_id,
        email: profile.email,
        avatar_url: avatar_url,
      };

      await clientData.updateProfile(updates);
    } catch (error: any) {
      alert(`Error updating profile: ${error.message}`);
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
    setValue("avatar_url", profile.avatar_url)
  }, [profile]);

  return (
    <Container maxW="container.lg">
      <Box>
        <Flex
          px={5}
          pt={5}
          pb={3}
          bg="white"
          flexDir={{
            base: "column",
            md: "row",
          }}
          gap={5}
        >
          <AccountAvatar
            url={avatar_url}
            isMe={isMe}
            onUpload={(url: any) => {
              setValue("avatar_url", url);
              updateProfile({ avatar_url: url });
            }}
          />
          <Flex
            minWidth={"40%"}
            flexDirection={"column"}
            justifyContent="center"
            ml={1}
          >
            <Heading size={"md"}>
              {`${profile.name} ${profile.surname}`} (@{profile.username})
            </Heading>
            <Text size={"md"}>
              Member since{" "}
              {profile.created_at
                ? dateToReadable(profile.created_at.toString(), false)
                : null}
            </Text>
            <HStack spacing={2}>
              <HiUserGroup />
              <Text size={"sm"} color={"gray.600"}>
                Hosted {profile.hosted_workshops}{" "}
                {profile.hosted_workshops == 1 ? "Workshop" : "Workshops"}
              </Text>
            </HStack>
          </Flex>
          <StatGroup alignContent={"center"} minWidth={"40%"}>
            <Stat>
              <HStack>
                <SiRuby color="red" />
                <StatLabel>Plenties Awarded</StatLabel>
              </HStack>
              <StatNumber>{roundNumber(profile.award_points)}</StatNumber>
            </Stat>
            <Stat>
              <HStack>
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
