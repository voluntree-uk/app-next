import {
  Button,
  Box,
  Text,
  Flex,
  Heading,
  Center,
  Switch,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsArrowRightCircleFill } from "react-icons/bs";
import FormInput from "./FormInput";
import { Grid, GridItem } from "@chakra-ui/react";
import { supabase } from "../utils/supabaseClient";

enum Mode {
  LOGIN,
  SIGNUP,
  RESETPASSWORD,
}

/**
 * Renders form for logging in or signing up a user
 */
export default function AuthenticationForm(): JSX.Element {
  const [mode, setMode] = React.useState<Mode>(Mode.LOGIN);

  const isLogginIn = () => mode === Mode.LOGIN;
  const isResettingPassword = () => mode === Mode.RESETPASSWORD;
  const isSigningUp = () => mode === Mode.SIGNUP;

  const toast = useToast();

  const toggleMode = () => {
    reset();
    setMode((prevMode) => {
      if (prevMode === Mode.LOGIN) {
        return Mode.SIGNUP;
      }
      return Mode.LOGIN;
    });
  };

  const router = useRouter();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>();

  async function onSubmit(formData: any): Promise<void> {
    switch (mode) {
      case Mode.SIGNUP:
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        break;
      case Mode.LOGIN:
        const signInReponse = await supabase.auth.signIn({
          email: formData.email,
          password: formData.password,
        });

        if (signInReponse.error === null) {
          router.push("/");
        }
        break;
      case Mode.RESETPASSWORD:
        // code block
        break;
      default:
      // code block
    }
  }

  const inputsToDisplay: any[] = [
    {
      field: "fullName",
      type: "text",
      label: "Full name",
      isVisible: isSigningUp(),
    },
    { field: "email", type: "email", label: "abc@email.com", isVisible: true },
    {
      field: "password",
      type: "password",
      label: "Your password",
      // hide password if resetting email
      isVisible: !isResettingPassword(),
    },
  ];

  return (
    <Box
      mt={40}
      pl={9}
      pr={9}
      pb={9}
      w={{ base: "100%", md: "40%", lg: "40%" }}
    >
      <Box mb={5}>
        <Heading fontSize={"2xl"} fontWeight="bold">
          {isLogginIn() && "Sign in"}
          {isSigningUp() && "Sign up"}
          {isResettingPassword() && "Reset password"}
        </Heading>

        {isResettingPassword() && (
          <Text fontSize={"sm"} mt={3} w={"95%"}>
            Please enter your email address to request a password reset
          </Text>
        )}
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid templateColumns="repeat(1, 1fr)" gap={4}>
          {inputsToDisplay.map((input, index) => (
            <GridItem key={index}>
              <FormInput
                field={input.field}
                type={input.type}
                placeholder={input.label}
                isVisible={input.isVisible}
                error={errors[input.field]}
                register={register}
              />
            </GridItem>
          ))}
        </Grid>

        <Flex
          justifyContent={"space-between"}
          alignItems="center"
          display={isResettingPassword() ? "none" : "flex"}
          mt={5}
        >
          {!isSigningUp() && (
            <Text fontSize={"sm"} display="flex" alignItems={"center"}>
              <Switch size={"md"} mr={2} colorScheme="brand.700" isChecked />
              Remember Me
            </Text>
          )}

          {!isSigningUp() && (
            <Text
              fontSize={"sm"}
              style={{ cursor: "pointer" }}
              onClick={() => setMode(Mode.RESETPASSWORD)}
            >
              Forgot Password?
            </Text>
          )}
        </Flex>

        <Center mt={10} mb={6}>
          <Button
            color="white"
            size="md"
            type="submit"
            isLoading={isSubmitting}
            w="75%"
            boxShadow={"2xl"}
            rightIcon={<BsArrowRightCircleFill />}
            py={7}
            borderRadius="2xl"
            bg="brand.700"
          >
            {isLogginIn() && "SIGN IN"}
            {isSigningUp() && "SIGN UP"}
            {isResettingPassword() && "SEND"}
          </Button>
        </Center>

        <Center mb={6}>
          <Text color="gray.400" fontSize={"md"} fontWeight="bold">
            OR
          </Text>
        </Center>

        <Center>
          <Text fontSize={"sm"}>
            {isLogginIn()
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <strong onClick={toggleMode} style={{ cursor: "pointer" }}>
              {isLogginIn() ? "Sign up" : "Sign in"}
            </strong>
          </Text>
        </Center>
      </form>
    </Box>
  );
}
