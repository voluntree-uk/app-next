import { Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabaseClient";
import AuthenticationInput from "./AuthInput";
import { FiSend } from "react-icons/fi";
import ActionButton from "./ActionButton";

type AuthFormState = {
  email: string;
};

export default function Auth() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<AuthFormState>();

  const handleLogin = async (formData: AuthFormState) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email: formData.email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box h="100vh" bgImage="linear-gradient(to top, #dfe9f3 0%, white 100%);">
      <Box pt={44} m={"0 auto"} w={{ base: "100%", md: "40%", lg: "40%" }}>
        <Heading size={"2xl"} mb={8} color="gray.700">
          Login
        </Heading>
        <Text mb={7} color="gray.700">
          Sign in via magic link with your email below
        </Text>

        <form onSubmit={handleSubmit(handleLogin)}>
          <Flex alignItems={"baseline"}>
            <AuthenticationInput
              field="email"
              placeholder="youremail@email.com"
              register={register}
              type="email"
              isVisible
              error={errors["email"]}
              getValues={getValues}
            />
            <ActionButton
              text="Send"
              icon={<FiSend />}
              type="submit"
              loading={loading}
              style={{ marginLeft: 5, width: "30%" }}
            />
          </Flex>
        </form>
      </Box>
    </Box>
  );
}
