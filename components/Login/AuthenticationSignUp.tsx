"use client";

import { ReactElement, useState } from "react";
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
  Stack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

interface IProps {
  signUp(
    email: string,
    password: string
  ): Promise<{ success: boolean; error: string | undefined }>;
}

export default function AuthenticationSignUp({ signUp }: IProps) {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const toast = useToast();

  const submit = async (formData: any) => {
    setIsLoading(true);

    const password = formData.signupPassword;
    const confirmedPassword = formData.signupConfirmedPassword;

    if (password !== confirmedPassword) {
      showToast("Passwords must match", null, false);
    }
    else {
      const isPasswordStrong:boolean = checkIfPasswordIsStrong(password);
      
      if(!isPasswordStrong)
      {
        const passwordStrengthMessage = "Password must be at least 8 characters long, "
            + "include an uppercase letter, a lowercase letter, a number, and a special character.";
        showToast("Password is weak", passwordStrengthMessage, false);
      }
      else{
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

  function checkIfPasswordIsStrong(password: string): boolean  {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    return passwordRegex.test(password);
  }
  

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
              {makeFormField(
                "signupPassword",
                "password",
                "Password",
                "password"
              )}
              {makeFormField(
                "signupConfirmedPassword",
                "password",
                "Confirm Password",
                "password"
              )}
              {/* Accept T&C */}
              <FormControl>
                <Checkbox fontSize={"sm"} id={"acceptT&C"} isRequired={true}>
                  I accept{" "}
                  <Link
                    as={NextLink}
                    color={"blue.500"}
                    href={process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL}
                    target="_blank"
                  >
                    Terms & Conditions
                  </Link>
                </Checkbox>
              </FormControl>
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
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </form>
  );
}
