import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { MdMailOutline, MdStarOutline, MdWorkOutline } from "react-icons/md";
import { supabase } from "../utils/supabaseClient";
import AccountAvatar from "./AccountAvatar";

export default function Account({ session }: { session: Session }) {
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
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setValue("username", data.username);
        setValue("avatar_url", data.avatar_url);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [setValue]);

  async function updateProfile({ username, avatar_url }: any) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (!user) {
        return;
      }

      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, [session, getProfile]);

  return (
    <Box>
      <Flex px={5} pt={5} mb={3}>
        <AccountAvatar
          url={avatar_url}
          onUpload={(url: any) => {
            setValue("avatar_url", url);
            updateProfile({ username, avatar_url: url });
          }}
        />
        <Flex flexDirection={"column"} justifyContent="center" ml={1}>
          <Heading size={"md"}>{username}</Heading>
          <Heading size={"sm"} color={"gray.500"} fontWeight="thin">
            {session.user?.email}
          </Heading>
        </Flex>
      </Flex>

      <Box>
        <Flex
          bg="white"
          h="12"
          borderBottomColor={"gray.200"}
          borderBottomWidth={1}
          borderTopColor={"gray.200"}
          borderTopWidth={1}
          alignItems="center"
          px={4}
          cursor="pointer"
          boxShadow={"sm"}
        >
          <Text color={"gray.600"} display={"flex"} alignItems={"center"}>
            <Box color={"brand.700"} mr={2}>
              <MdMailOutline />
            </Box>
            Bookings
          </Text>
        </Flex>
        <Flex
          bg="white"
          h="12"
          borderBottomColor={"gray.200"}
          borderBottomWidth={1}
          alignItems="center"
          px={4}
          cursor="pointer"
        >
          <Text color={"gray.600"} display={"flex"} alignItems={"center"}>
            <Box color={"brand.700"} mr={2}>
              <MdWorkOutline />
            </Box>
            Workshops
          </Text>
        </Flex>
        <Flex
          bg="white"
          h="12"
          borderBottomColor={"gray.200"}
          borderBottomWidth={1}
          alignItems="center"
          px={4}
          cursor="pointer"
          boxShadow={"sm"}
        >
          <Text color={"gray.600"} display={"flex"} alignItems={"center"}>
            <Box color={"brand.700"} mr={2}>
              <MdStarOutline />
            </Box>
            Saved
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
