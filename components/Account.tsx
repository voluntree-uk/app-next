import { Box, Button, Divider, Flex, Heading, Input } from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { supabase } from "../utils/supabaseClient";
import AccountAvatar from "./AccountAvatar";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<null | string>(null);
  const [avatar_url, setAvatarUrl] = useState<null | string>(null);

  const router = useRouter();

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
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
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
    <Box>
      <AccountAvatar
        url={avatar_url}
        onUpload={(url: any) => {
          setAvatarUrl(url);
          updateProfile({ username, avatar_url: url });
        }}
      />

      <Heading my={7} size="xl">
        {username}
      </Heading>

      <Box mt={5}>
        <Input
          id="email"
          type="text"
          value={(session as any).user.email}
          disabled
          mb={3}
        />

        <Input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          mb={3}
        />

        <Flex justifyContent={"space-between"} mt={3}>
          <Button
            className="button block primary"
            onClick={() => updateProfile({ username, avatar_url })}
            disabled={loading}
            mr={1}
            color="white"
            bg="brand.700"
            _hover={{ backgroundColor: "#4A43EC" }}
            rightIcon={<MdUpdate />}
          >
            {loading ? "Loading ..." : "Update"}
          </Button>

          <Button
            className="button block"
            rightIcon={<FaSignOutAlt />}
            onClick={() => {
              supabase.auth.signOut();
              router.push("/auth");
            }}
          >
            Sign Out
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
