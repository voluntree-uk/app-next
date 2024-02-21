import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Box, Container, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { IconContext } from "react-icons";
import { HiOutlineMail, HiUserGroup, HiOutlineStar } from "react-icons/hi";
import { SiRuby } from "react-icons/si";
import { auth } from "@auth/supabase";
import { data } from "@data/supabase";
import { User } from "@schemas";
import AccountAvatar from "@components/AccountAvatar";
import { dateToReadable } from "@util/dates";

export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(true);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const username: string = watch("username");
  const avatar_url: string = watch("avatar_url");
  const full_name: string = watch("full_name");
  const member_since: string = watch("member_since");
  const hosted_workshops: number = watch("hosted_workshops");
  const rating: number = watch("rating");
  const reviews_received: number = watch("reviews_received");
  const award_points: number = watch("award_points");

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const user = await auth.getUser();

      if (!user) {
        return;
      }

      const profile = await data.getProfile(user.id);

      if (profile) {
        setValue("username", profile.username);
        setValue("avatar_url", profile.avatar_url);
        setValue("full_name", `${profile.name} ${profile.surname}`);
        setValue("member_since", profile.created_at);
        setValue("hosted_workshops", profile.hosted_workshops);
        setValue("rating", profile.rating);
        setValue("reviews_received", profile.reviews_received);
        setValue("award_points", profile.award_points);
      }
    } catch (error: any) {
      alert(`Error getting profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [setValue]);

  async function updateProfile({ avatar_url }: any) {
    try {
      setLoading(true);
      const user = await auth.getUser();

      if (!user) {
        return;
      }

      const updates = {
        user_id: user.id,
        avatar_url: avatar_url,
      };

      await data.updateProfile(updates);
    } catch (error: any) {
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function roundNumber(number: number | undefined, decimals: number = 0): string {
    return (number !== undefined) ? number.toFixed(decimals) : "";
  }

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

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
            onUpload={(url: any) => {
              setValue("avatar_url", url);
              updateProfile({ avatar_url: url });
            }}
          />
          <Flex flexDirection={"column"} justifyContent="center" ml={1}>
            <Heading size={"md"}>
              {full_name} (@{username})
            </Heading>
            <Text size={"md"}>
              Member since {dateToReadable(member_since, false)}
            </Text>
            <HStack spacing={2}>
              <HiOutlineMail />
              <Text size={"sm"} color={"gray.600"}>
                {user?.email}
              </Text>
            </HStack>
            <HStack spacing={2}>
              <HiUserGroup />
              <Text size={"sm"} color={"gray.600"}>
                Hosted {hosted_workshops}{" "}
                {hosted_workshops == 1 ? "Workshop" : "Workshops"}
              </Text>
            </HStack>
            <HStack spacing={2}>
              <HiOutlineStar />
              <Text size={"sm"} color={"gray.600"}>
                {roundNumber(rating, 1)} ({reviews_received})
              </Text>
            </HStack>
            <HStack spacing={2}>
              <IconContext.Provider value={{ color: "red" }}>
                <SiRuby />
              </IconContext.Provider>
              <Text size={"sm"} color={"gray.600"}>
                {roundNumber(award_points)}
              </Text>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
}
