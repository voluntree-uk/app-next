"use client";

import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import NextLink from "next/link";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  isPasswordStrong,
  PasswordStrengthChecklist,
} from "@components/Login/PasswordStrength";

interface IProps {
  signUp(
    email: string,
    password: string
  ): Promise<{ success: boolean; error: string | undefined }>;
}

export default function AuthenticationSignUp({ signUp }: IProps) {
  const { register, handleSubmit, watch } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const toast = useToast();

  const passwordValue: string = watch("signupPassword") || "";

  const submit = async (formData: any) => {
    setIsLoading(true);

    const password = formData.signupPassword;
    const confirmedPassword = formData.signupConfirmedPassword;

    if (password !== confirmedPassword) {
      showToast("Passwords must match", null, false);
    }
    else {
      const strong = isPasswordStrong(password);
      
      if (!strong) {
        const passwordStrengthMessage =
          "Password must meet all the requirements in the checklist below.";
        showToast("Password is weak", passwordStrengthMessage, false);
      } else {
        const { success, error } = await signUp(formData.signupEmail, password);

        if (error) {
          showToast("Sign Up Unsuccessful", error, false);
        }
  
        if (success) {
          showToast("Success", "Verify your email to continue");
          router.push("/");
        } else {
          showToast("Sign Up Unsuccessful");
        }    
      }
    }

    setIsLoading(false);
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
    <form onSubmit={handleSubmit(submit)}>
      <Stack spacing={6}>
        <Box>
          <Stack mb={4}>
            <Heading size={"md"}>
              Create an account
            </Heading>
          </Stack>
          <Stack spacing={5}>
            <Stack spacing={4}>
              {makeFormField(
                "signupEmail",
                "email",
                "Email",
                "Enter your email"
              )}
              {makeFormField(
                "signupPassword",
                "password",
                "Password",
                "Choose a strong password"
              )}
              {makeFormField(
                "signupConfirmedPassword",
                "password",
                "Confirm password",
                "Re-enter your password"
              )}
              <Box bg="gray.100" borderRadius="xl" p={{ base: 6, md: 8 }} boxShadow="sm">
                <Text fontWeight="semibold" color="gray.600" mb={3}>Password Strength Requirements</Text>
                <PasswordStrengthChecklist password={passwordValue} />
              </Box>
              <FormControl>
                <Checkbox fontSize={"sm"} id={"acceptT&C"} isRequired={true}>
                  I accept{" "}
                  <Link
                    as={NextLink}
                    color={"blue.500"}
                    href={process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL}
                    target="_blank"
                  >
                    Terms &amp; Conditions
                  </Link>
                </Checkbox>
              </FormControl>
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
                  Join Voluntree
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </form>
  );
}
