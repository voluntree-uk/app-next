import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Session, User } from "@supabase/supabase-js";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { MdMailOutline, MdStarOutline, MdWorkOutline } from "react-icons/md";
import { supabase } from "../supabase/supabaseClient";
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
      const user = supabase.auth.user();

      if (!user) {
        return;
      }

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("user_id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setValue("username", data.username);
        setValue("avatar_url", data.avatar_url);
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
      const user = supabase.auth.user();

      if (!user) {
        return;
      }

      const updates = {
        user_id: user.id,
        avatar_url: avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
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
