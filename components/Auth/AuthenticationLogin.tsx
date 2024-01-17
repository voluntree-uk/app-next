import * as React from "react";
import { ReactElement } from "react";
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
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from '@chakra-ui/icons'
import { OAuthButtonGroup } from "@components/Auth/0AuthButtonGroup";
import { useRouter } from "next/router";
import { auth } from "@auth/supabase";

interface IProps {
  onSuccess(): void;
}

enum Mode {
  LOGIN,
  RESET_PASSWORD,
}

export default function AuthenticationLogin({ onSuccess }: IProps) {
  const [mode, setMode] = React.useState<Mode>(Mode.LOGIN);
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const toast = useToast();

  /**
   * Get the path to be redirected to after successful authentication
   * Remain on listing route after authentication if user was viewing a listing,
   * otherwise redirect to workshop list route
   *
   * @returns redirect route
   */
  const getRedirectPath = () => {
    return router.pathname === "/workshops/[wid]"
      ? router.asPath
      : "/workshops";
  };

  const logIn = async (formData: any) => {
    setIsLoading(true);
    try {
      const success = await auth.signIn(formData.email, formData.password);

      if (success) {
        onSuccess();
        showToast("Login Successful");

        router.push(getRedirectPath());
      }
    } catch (error: any) {
      showToast("Login Unsuccessful", error.message, false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (formData: any) => {
    setIsLoading(true);
    try {
      const success = await auth.resetPassword(formData.email, `${window.location.origin}/auth/update-password`);

      if (success) {
        onSuccess();
        showToast("Check your email to complete password reset");

        router.push(getRedirectPath());
      }
    } catch (error: any) {
      showToast("Password Reset  Unsuccessful", error.message, false);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (mode === Mode.LOGIN) {
      logIn(formData);
    } else {
      resetPassword(formData);
    }
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

  const backArrowIcon: ReactElement =
    <ArrowBackIcon
      boxSize={6}
      onClick={() => setMode(Mode.LOGIN)}
    />
  
  const forgotPasswordLink: ReactElement =
    <Link
      onClick={() => { setMode(Mode.RESET_PASSWORD) }}
      fontSize="sm"
      whiteSpace="nowrap"
    >
      Forgot Password?
    </Link> 

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="8">
        <Box
          py={{ base: "4", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg={useBreakpointValue({ base: "white", sm: "white" })}
          boxShadow={{ base: "none" }}
          borderRadius={{ base: "2xl", sm: "xl" }}
        >
          {mode === Mode.RESET_PASSWORD ? backArrowIcon : null}
          <Stack textAlign="center" padding="5">
            <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
              {mode === Mode.LOGIN
                ? "Log in to your account"
                : "Reset Password "}
            </Heading>
          </Stack>
          <Stack spacing="6">
            <Stack spacing="3">
              {makeFormField("email", "email", "Email", "email")}
              {mode === Mode.LOGIN
                ? makeFormField("password", "password", "Password", "password")
                : null}
            </Stack>
            <Stack spacing="6">
              <Stack>
                <Button
                  colorScheme={"green"}
                  type="submit"
                  isLoading={isLoading}
                  boxShadow="lg"
                >
                  {mode === Mode.LOGIN ? "Sign in" : "Reset Password"}
                </Button>
                {mode === Mode.LOGIN ? forgotPasswordLink : null}
              </Stack>
              {mode === Mode.LOGIN ? <OAuthButtonGroup /> : null}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </form>
  );
}
