import * as React from "react";
import { ReactElement } from "react";
import { User } from "@supabase/supabase-js";
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
import { useRouter } from "next/router";
import { auth } from "@auth/supabase";
import { data } from "@data/supabase";

export default function SetupProfile({ user }: { user: User }) {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const toast = useToast();

  const setupProfile = async (formData: any) => {
    setIsLoading(true);
    try {
      // Form validation should go here. Users must be over 18 years old, etc.
      const values = {
        user_id: user.id,
        username: formData.username,
        name: formData.name,
        surname: formData.surname,
        dob: formData.dob,
      };

      const profile = await data.createProfile(values);

      showToast("Successfully updated profile");
      router.push("/");

    } catch (error: any) {
      showToast("Failed to setup profile", error.message, false);
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
    <form onSubmit={handleSubmit(setupProfile)}>
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
              Let's finish setting up your profile
            </Heading>
          </Stack>
          <Stack spacing="6">
            <Stack spacing="3">
              {makeFormField("name", "text", "Name", "Name")}
              {makeFormField("surname", "text", "Surname", "Surname")}
              {makeFormField("dob", "date", "Date of Birth", "")}
              {makeFormField("username", "text", "Username", "username")}
            </Stack>
            <Stack spacing="6">
              <Stack>
                <Button
                  colorScheme={"green"}
                  type="submit"
                  isLoading={isLoading}
                  boxShadow="lg"
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </form>
  );
}

export async function getServerSideProps({ req }: any) {
  const user = await auth.getUserByCookie(req);

  if (!user) {
    return { props: {}, redirect: { destination: "/" } };
  }

  const hasProfile = await data.hasProfile(user.id)

  if (hasProfile) {
    return { props: {}, redirect: { destination: "/" } };
  }

  return {
    props: { user },
  };
}
