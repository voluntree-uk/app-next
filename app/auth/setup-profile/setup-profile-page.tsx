"use client"

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { isOlderThan } from "@util/dates";

interface IProps {
  setupProfile(
    firstName: string,
    lastName: string,
    dob: string,
    username: string
  ): Promise<{ success: boolean; error?: string }>;
}

export default function SetupProfilePage({ setupProfile }: IProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [dob, setDOB] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

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
    if (!firstName) {
      setFirstName("");
      isValid = false;
    }
    if (!lastName) {
      setLastName("");
      isValid = false;
    }
    if (!dob) {
      setDOB("");
      isValid = false;
    } else {
      try {
        const userDOB = new Date(dob);
        if (!isOlderThan(userDOB, { years: 18 })) {
          isValid = false;
        }
      } catch (err) {
        isValid = false;
      }
    }
    if (!username) {
      setUsername("");
      isValid = false;
    }
    return isValid;
  }

  async function onSubmit() {
    setLoading(true);

    if (validateForm()) {
      const { success, error } = await setupProfile(firstName!, lastName!, dob!, username!);
      if (success) {
        showToast("Successfully updated profile");
        router.push("/");
      }
      if (error) {
        showToast("Failed to setup profile", error, false);
      }
    }

    setLoading(false);
  }

  return (
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
            {/* First Name */}
            <FormControl isInvalid={firstName === ""}>
              <FormLabel htmlFor="firstName" fontSize={"md"}>
                First Name
              </FormLabel>
              <Input
                id="firstName"
                type="text"
                isRequired={true}
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                p="4"
              />
              {firstName === "" && (
                <FormErrorMessage>Name is required</FormErrorMessage>
              )}
            </FormControl>
            {/* Last Name */}
            <FormControl isInvalid={lastName === ""}>
              <FormLabel htmlFor="lastName" fontSize={"md"}>
                Last Name
              </FormLabel>
              <Input
                id="lastName"
                type="text"
                isRequired={true}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                p="4"
              />
              {lastName === "" && (
                <FormErrorMessage>Last name is required</FormErrorMessage>
              )}
            </FormControl>
            {/* Date of Birth */}
            <FormControl
              isInvalid={
                dob === "" ||
                (dob != null && !isOlderThan(new Date(dob!), { years: 18 }))
              }
            >
              <FormLabel htmlFor="dob" fontSize={"md"}>
                Date of Birth
              </FormLabel>
              <Input
                id="dob"
                type="date"
                isRequired={true}
                onChange={(e) => setDOB(e.target.value)}
                p="4"
              />
              {dob === "" ||
                (dob != null && !isOlderThan(new Date(dob!), { years: 18 }) && (
                  <FormErrorMessage>
                    You must be at least 18 years old
                  </FormErrorMessage>
                ))}
            </FormControl>
            {/* Username */}
            <FormControl isInvalid={username === ""}>
              <FormLabel htmlFor="username" fontSize={"md"}>
                Username
              </FormLabel>
              <Input
                id="username"
                type="text"
                isRequired={true}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                p="4"
              />
              {username === "" && (
                <FormErrorMessage>Username is required</FormErrorMessage>
              )}
            </FormControl>
          </Stack>
          <Stack spacing="6">
            <Stack>
              {/* Submit */}
              <Button
                colorScheme={"green"}
                type="submit"
                isLoading={loading}
                onClick={() => onSubmit()}
                boxShadow="lg"
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}