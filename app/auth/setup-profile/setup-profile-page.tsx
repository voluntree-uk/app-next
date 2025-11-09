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
  Text,
  useBreakpointValue,
  useToast,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
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
  const [usernameTaken, setUsernameTaken] = useState<boolean>(false);

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
        showToast("Profile saved", "Thanks for introducing yourself!");
        router.push("/me");
      }
      if (error == "username_taken") {
        setUsernameTaken(true);
      } else if (error) {
        showToast("Failed to setup profile", error, false);
      }
    }

    setLoading(false);
  }

  return (
    <Box py={{ base: 12, md: 16 }}>
      <Box maxW="6xl" mx="auto" px={{ base: 6, md: 10 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 10, lg: 14 }} alignItems="stretch">
          <Box bg="white" borderRadius="xl" p={{ base: 6, md: 8 }} boxShadow="md">
            <Stack spacing={4} mb={6} textAlign={{ base: "center", lg: "left" }}>
              <Heading size={useBreakpointValue({ base: "lg", md: "xl" })}>
                Introduce yourself to the community
              </Heading>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                It only takes a moment. A friendly profile helps learners feel comfortable before they join your session.
              </Text>
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
                  {firstName === "" && <FormErrorMessage>Name is required</FormErrorMessage>}
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
                  {lastName === "" && <FormErrorMessage>Last name is required</FormErrorMessage>}
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
                      <FormErrorMessage>You must be at least 18 years old</FormErrorMessage>
                    ))}
                </FormControl>
                {/* Username */}
                <FormControl isInvalid={username === "" || usernameTaken}>
                  <FormLabel htmlFor="username" fontSize={"md"}>
                    Username
                  </FormLabel>
                  <Input
                    id="username"
                    type="text"
                    isRequired={true}
                    placeholder="Username"
                    onChange={(e) => {
                      setUsernameTaken(false);
                      setUsername(e.target.value);
                    }}
                    p="4"
                  />
                  {(username === "" || usernameTaken) && (
                    <FormErrorMessage>
                      {usernameTaken
                        ? "A user with that username already exists"
                        : "Username is required"}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
              <Stack spacing="4">
                <Button
                  colorScheme={"green"}
                  type="submit"
                  isLoading={loading}
                  onClick={() => onSubmit()}
                  boxShadow="lg"
                >
                  Save profile
                </Button>
                <Button as={NextLink} href="/workshops" variant="ghost" colorScheme="blue">
                  Skip for now
                </Button>
              </Stack>
            </Stack>
          </Box>
          <Box bg="gray.50" borderRadius="xl" p={{ base: 6, md: 8 }} display="flex" flexDirection="column" justifyContent="flex-start">
            <Stack spacing={{ base: 6, md: 8 }}>
              <Box>
                <Heading size="md" color="gray.700" mb={3}>
                  Why it matters
                </Heading>
                <Text color="gray.600">
                  Your profile introduces you whether you're joining a workshop to learn or hosting one to share. It helps the whole community feel confident connecting with you.
                </Text>
              </Box>
              <Box bg="white" borderRadius="xl" p={{ base: 6, md: 8 }} boxShadow="sm">
                <Heading size="sm" color="gray.700" mb={4}>
                  With a complete profile you can:
                </Heading>
                <List spacing={3} color="gray.600" fontSize="md">
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Help others recognise you before you meet in a session.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Get invited to learn or teach when people search for your interests and skills.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Update details anytime as your journey evolves.
                  </ListItem>
                </List>
              </Box>
            </Stack>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}