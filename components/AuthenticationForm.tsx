import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabaseClient";
import { OAuthButtonGroup } from "./0AuthButtonGroup";
import { Logo } from "./Logo";
import { useToast } from "@chakra-ui/react";

export default function AuthenticationForm() {
  const { register, handleSubmit } = useForm();
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signIn(
      {
        email: data.email,
      },
      {
        redirectTo: process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL,
      }
    );

    if (error === null) {
      toast({
        title: "Sign in link sent.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "24" }}
      px={{ base: "7", sm: "8" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Logo />
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
                Log in to your account
              </Heading>
              <HStack spacing="1" justify="center">
                <Text color="muted">
                  We&apos;ll send a login link to your email
                </Text>
              </HStack>
            </Stack>
          </Stack>
          <Box
            py={{ base: "0", sm: "8" }}
            px={{ base: "4", sm: "10" }}
            bg={useBreakpointValue({ base: "transparent", sm: "bg-surface" })}
            boxShadow={{ base: "none", sm: useColorModeValue("md", "md-dark") }}
            borderRadius={{ base: "none", sm: "xl" }}
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input {...register("email")} id="email" type="email" />
                </FormControl>
              </Stack>
              <Stack spacing="6">
                <Button
                  color={"white"}
                  variant="contained"
                  bg="brand.700"
                  type="submit"
                  isLoading={isLoading}
                  _hover={{ backgroundColor: "#5c56eeF0" }}
                >
                  Send link
                </Button>
                <HStack>
                  <Divider />
                  <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                    or continue with
                  </Text>
                  <Divider />
                </HStack>
                <OAuthButtonGroup />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Container>
  );
}
