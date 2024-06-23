"use client"

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface IProps {
  updatePassword(
    password: string
  ): Promise<{ success: boolean; error: string | undefined }>;
}

export default function UpdatePasswordPage({ updatePassword }: IProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  const [password, setPassword] = useState<string | null>(null);
  const [confirmedPassword, setConfirmedPassword] = useState<string | null>(null);

  /**
   * Redirect to after successful authentication
   * Remain on listing route after authentication if user was viewing a listing,
   * otherwise redirect to workshop list route
   *
   * @returns redirect route
   */
  const redirect = () => {
    return pathname === "/workshops/[wid]"
      ? router.back()
      : router.push("/workshops");
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

  function validateForm(): boolean {
    var isValid = true;
    if (!password) {
      setPassword("");
      isValid = false;
    }
    if (!confirmedPassword) {
      setConfirmedPassword("");
      isValid = false;
    }
    if (password !== confirmedPassword) {
      isValid = false;
    }
    return isValid;
  }

  async function onSubmit() {
    setLoading(true);

    if (validateForm()) {
      const { success, error } = await updatePassword(password!);
      if (error) {
        showToast("Failed to update password", error, false);
      } else {
        showToast("Successfully updated password");
        redirect();
      }
    }

    setLoading(false);
  }

  return (
    <Stack paddingLeft={"10vw"} paddingRight={"10vw"}>
      <Box
        py={{ base: "4", sm: "8" }}
        px={{ base: "4", sm: "10" }}
        bg={useBreakpointValue({ base: "white", sm: "white" })}
        boxShadow={{ base: "none" }}
        borderRadius={{ base: "2xl", sm: "xl" }}
      >
        <Stack textAlign="center" padding="5">
          <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
            Choose New Password
          </Heading>
        </Stack>
        <Stack spacing="6">
          <Stack spacing="3">
            {/* Password */}
            <FormControl isInvalid={password === ""}>
              <FormLabel htmlFor="password" fontSize={"md"}>
                New Password
              </FormLabel>
              <Input
                id="password"
                type="password"
                isRequired={true}
                placeholder="New Password"
                onChange={(e) => setPassword(e.target.value)}
                p="4"
              />
              {password === "" ? (
                <FormErrorMessage>Password is required</FormErrorMessage>
              ) : (
                <FormHelperText>Choose a strong password</FormHelperText>
              )}
            </FormControl>
            {/* Confirmed password */}
            <FormControl
              isInvalid={
                confirmedPassword != null && password !== confirmedPassword
              }
            >
              <FormLabel fontSize={"sm"} htmlFor="confirmedPassword">
                Confirm Password
              </FormLabel>
              <Input
                id="confirmedPassword"
                type="password"
                isRequired={true}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmedPassword(e.target.value)}
                p="4"
              />
              {confirmedPassword != null && password !== confirmedPassword ? (
                <FormErrorMessage>Passwords must match</FormErrorMessage>
              ) : null}
            </FormControl>
          </Stack>
          <Stack spacing="6">
            <Stack>
              {/* Submit */}
              <Button
                colorScheme={"green"}
                type="submit"
                boxShadow="lg"
                isLoading={loading}
                onClick={() => onSubmit()}
              >
                Set New Password
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
