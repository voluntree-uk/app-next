import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../shared/auth/supabase";
import { data } from "../shared/data/supabase";
import { User } from "../shared/schemas";
import AccountAvatar from "./AccountAvatar";

export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(true);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { username, avatar_url } = watch();

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const user = await auth.getUser();

      if (!user) {
        return;
      }

      const profile = await data.getProfile(user.id)

      if (profile) {
        setValue("username", profile.username);
        setValue("avatar_url", profile.avatar_url);
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

      await data.updateProfile(updates)
    } catch (error: any) {
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  return (
    <Box>
      <Flex px={5} pt={5} pb={3} bg="white">
        <AccountAvatar
          url={avatar_url}
          onUpload={(url: any) => {
            setValue("avatar_url", url);
            updateProfile({ avatar_url: url });
          }}
        />
        <Flex flexDirection={"column"} justifyContent="center" ml={1}>
          <Heading size={"md"}>{username}</Heading>
          <Text size={"sm"} color={"gray.600"}>
            {user?.email}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
