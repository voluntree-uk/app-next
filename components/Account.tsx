import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  Input,
} from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
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
    <Box px={8} pt={20}>
      <AccountAvatar
        url={avatar_url}
        onUpload={(url: any) => {
          setValue("avatar_url", url);
          updateProfile({ username, avatar_url: url });
        }}
      />

      <Center mt={4}>
        <Heading
          size={"md"}
          color={"gray.500"}
          fontWeight="thin"
          fontStyle={"italic"}
        >
          {session.user?.email}
        </Heading>
      </Center>

      <Box mt={10}>
        <Grid templateColumns="repeat(1, 1fr)" gap={4}></Grid>

        <Button
          className="button block primary"
          onClick={() => updateProfile({ username, avatar_url })}
          disabled={loading}
          mt={6}
          w={"100%"}
          bg="brand.700"
          color={"white"}
          _hover={{ backgroundColor: "#4A43EC" }}
        >
          {loading ? "Loading ..." : "Update"}
        </Button>
      </Box>
    </Box>
  );
}
