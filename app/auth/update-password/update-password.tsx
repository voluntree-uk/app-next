"use client"

import * as React from "react";
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
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@util/supabase/client";

export default function UpdatePasswordPage() {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const supabase = createClient();

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

  const setPassword = async (formData: any) => {
    setIsLoading(true);
    try {
      const newPassword = formData.password;
      const confirmedPassword = formData.confirmedPassword;
      if (newPassword === confirmedPassword) {
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          showToast("Failed to update password", error.message, false);
        } else {
          showToast("Successfully updated password");
          redirect();
        }
      } else {
        showToast("Passwords must match", null, false);
      }
    } catch (error: any) {
      console.log(`ERROR: ${JSON.stringify(error)}`)
      showToast("Failed to update password", error.msg, false);
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

  return (
    <form onSubmit={handleSubmit(setPassword)}>
      <Stack
        paddingLeft={"10vw"}
        paddingRight={"10vw"}
      >
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
              <FormControl>
                <FormLabel fontSize={"sm"} htmlFor="password">
                  New Password
                </FormLabel>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  isRequired={true}
                  placeholder="New Password"
                  p="4"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={"sm"} htmlFor="confirmedPassword">
                  Confirm Password
                </FormLabel>
                <Input
                  {...register("confirmedPassword")}
                  id="confirmedPassword"
                  type="password"
                  isRequired={true}
                  placeholder="Confirm Password"
                  p="4"
                />
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
                  Set New Password
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </form>
  );
}
