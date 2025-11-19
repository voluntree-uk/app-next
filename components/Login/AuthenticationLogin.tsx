"use client";

import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Link,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

interface IProps {
  signIn(
    email: string,
    password: string
  ): Promise<{ success: boolean; error: string | undefined }>;
  resetPassword(
    email: string
  ): Promise<{ success: boolean; error: string | undefined }>;
}

enum Mode {
  LOGIN,
  RESET_PASSWORD,
}

export default function AuthenticationLogin({ signIn, resetPassword }: IProps) {
  const [mode, setMode] = useState<Mode>(Mode.LOGIN);
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const showToast = (
    title: any,
    description: any = null,
    success: boolean = true
  ) => {
    toast({
      title: title,
      description: description,
      status: success ? "success" : "error",
      duration: 4000,
      isClosable: true,
    });
  };

  const onSubmit = async (formData: any) => {
    setIsLoading(true);
    if (mode === Mode.LOGIN) {
      const { success, error } = await signIn(
        formData.loginEmail,
        formData.loginPassword
      );
      if (error) showToast("Login Unsuccessful", error, false);
      if (success) {
        showToast("Login Successful");
        router.back();
        router.refresh();
      }
    } else {
      const { success, error } = await resetPassword(formData.loginEmail);
      if (error) showToast("Password Reset Unsuccessful", error, false);
      if (success) showToast("Check your email to complete password reset");
    }
    setIsLoading(false);
  };

  const makeFormField = (
    id: string,
    type: string,
    title: string,
    placeholder: string
  ): ReactElement => {
    return (
      <FormControl>
        <FormLabel fontSize={"sm"} htmlFor={id}>
          {title}
        </FormLabel>
        <Input
          {...register(id)}
          id={id}
          type={type}
          isRequired={true}
          placeholder={placeholder}
          p="4"
        />
      </FormControl>
    );
  };

  const backArrowIcon: ReactElement = (
    <ArrowBackIcon boxSize={6} onClick={() => setMode(Mode.LOGIN)} />
  );

  const forgotPasswordLink: ReactElement = (
    <Link
      onClick={() => {
        setMode(Mode.RESET_PASSWORD);
      }}
      fontSize="sm"
      whiteSpace="nowrap"
    >
      Forgot Password?
    </Link>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <Box>
          <HStack mb={4}>
            {mode === Mode.RESET_PASSWORD ? backArrowIcon : null}
            <Heading size={"md"}>
              {mode === Mode.LOGIN
                ? "Log in to your account"
                : "Reset your password"}
            </Heading>
          </HStack>
          <Stack spacing={5}>
            <Stack spacing={4}>
              {makeFormField("loginEmail", "email", "Email", "Enter your email")}
              {mode === Mode.LOGIN
                ? makeFormField(
                    "loginPassword",
                    "password",
                    "Password",
                    "Enter your password"
                  )
                : null}
            </Stack>
            <Stack spacing={4}>
              <Stack>
                <Button
                  colorScheme={"blue"}
                  type="submit"
                  isLoading={isLoading}
                  boxShadow="md"
                  w="full"
                >
                  {mode === Mode.LOGIN ? "Sign in" : "Send reset link"}
                </Button>
                {mode === Mode.LOGIN ? forgotPasswordLink : null}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </form>
  );
}
