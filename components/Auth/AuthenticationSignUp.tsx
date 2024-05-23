import * as React from "react";
import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { OAuthButtonGroup } from "@components/Auth/0AuthButtonGroup";
import { useRouter } from "next/router";
import { auth } from "@auth/supabase";

interface IProps {
  onSuccess(): void;
}

export default function AuthenticationSignUp({ onSuccess }: IProps) {
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
      : "/me";
  };

  const signUp = async (formData: any) => {
    setIsLoading(true);
    try {
      const password = formData.signupPassword;
      const confirmedPassword = formData.signupConfirmedPassword;

      if (password === confirmedPassword) {
        const success = await auth.signUp(formData.signupEmail, password);

        if (success) {
          showToast("Success", "Verify your email to continue");
          onSuccess();
          router.push(getRedirectPath());
        } else {
          showToast("Sign Up Unsuccessful");
        }
      } else {
        showToast("Passwords must match", null, false);
      }
    } catch (error: any) {
      showToast("Sign Up Unsuccessful", error.message, false);
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

  return (
    <form onSubmit={handleSubmit(signUp)}>
      <Stack spacing="8">
        <Box
          py={{ base: "4", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg={useBreakpointValue({ base: "white", sm: "white" })}
          boxShadow={{ base: "none" }}
          borderRadius={{ base: "2xl", sm: "xl" }}
        >
          <Stack textAlign="center" padding="5">
            <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
              Create an account
            </Heading>
          </Stack>
          <Stack spacing="6">
            <Stack spacing="3">
              {makeFormField("signupEmail", "email", "Email", "email")}
              {makeFormField("signupPassword", "password", "Password", "password")}
              {makeFormField("signupConfirmedPassword", "password", "Confirm Password", "password")}
            </Stack>
            <Stack spacing="6">
              <Stack>
                <Button
                  colorScheme={"green"}
                  type="submit"
                  isLoading={isLoading}
                  boxShadow="lg"
                >
                  Sign up
                </Button>
              </Stack>
              <OAuthButtonGroup />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </form>
  );
}
