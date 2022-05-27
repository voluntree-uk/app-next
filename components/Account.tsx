import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
} from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabaseClient";
import AccountAvatar from "./AccountAvatar";
import FormInput from "./FormInput";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { username, avatar_url } = watch();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (!user) {
        return;
      }

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
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
  }

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

  return (
    <Box p={10} mt={8}>
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

      <Divider my={8} />

      <Box>
        <Grid templateColumns="repeat(1, 1fr)" gap={4}>
          <FormInput
            field="username"
            type="text"
            placeholder="Username"
            register={register}
            error={errors["username"]}
            isVisible
          />

          <FormInput
            field="role"
            type="text"
            placeholder="Volunteer"
            register={register}
            error={errors["role"]}
            isVisible
            disabled
          />

          <FormInput
            field="city"
            type="text"
            placeholder="Bristol"
            register={register}
            error={errors["city"]}
            isVisible
            disabled
          />
        </Grid>

        <Flex justifyContent={"center"}>
          <Button
            className="button block primary"
            onClick={() => updateProfile({ username, avatar_url })}
            disabled={loading}
            mt={6}
            w={"100%"}
          >
            {loading ? "Loading ..." : "Update"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
