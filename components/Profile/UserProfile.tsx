import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Container, Flex, Heading, HStack, Text, Tooltip } from "@chakra-ui/react";
import { IconContext } from "react-icons";
import { HiUserGroup, HiOutlineStar } from "react-icons/hi";
import { SiRuby } from "react-icons/si";
import { auth } from "@auth/supabase";
import { data } from "@data/supabase";
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
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const avatar_url: string = watch("avatar_url");

  async function updateProfile({ avatar_url }: any) {
    try {
      setLoading(true);
      const user = await auth.getUser();

      if (!user) {
        return;
      }

      const updates = {
        user_id: user.id,
        email: user.email,
        avatar_url: avatar_url,
      };

      await data.updateProfile(updates);
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
    <Container maxW="container.sm">
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
          gap={10}
        >
          <AccountAvatar
            url={avatar_url}
            isMe={isMe}
            onUpload={(url: any) => {
              setValue("avatar_url", url);
              updateProfile({ avatar_url: url });
            }}
          />
          <Flex flexDirection={"column"} justifyContent="center" ml={1}>
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
            <HStack spacing={2}>
              <HiOutlineStar />
              <Tooltip hasArrow label="Volunteer Rating" placement="auto-start">
                <Text size={"sm"} color={"gray.600"}>
                  {roundNumber(profile.rating, 1)} ({profile.reviews_received})
                </Text>
              </Tooltip>
            </HStack>
            <HStack spacing={2}>
              <IconContext.Provider value={{ color: "red" }}>
                <SiRuby />
              </IconContext.Provider>
              <Tooltip hasArrow label="Plenties Awarded" placement="auto-start">
                <Text size={"sm"} color={"gray.600"}>
                {roundNumber(profile.award_points)}
                </Text>
              </Tooltip>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
}
