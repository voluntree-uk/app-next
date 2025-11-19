"use client"

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
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter, usePathname } from "next/navigation";
import { useState, useMemo } from "react";

interface IProps {
  updatePassword(
    password: string
  ): Promise<{ success: boolean; error: string | undefined }>;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export default function UpdatePasswordPage({ updatePassword }: IProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");

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

  const passwordRequirements = useMemo((): PasswordRequirement[] => {
    return [
      {
        label: "At least 8 characters",
        met: password.length >= 8,
      },
      {
        label: "Contains uppercase letter",
        met: /[A-Z]/.test(password),
      },
      {
        label: "Contains lowercase letter",
        met: /[a-z]/.test(password),
      },
      {
        label: "Contains number",
        met: /[0-9]/.test(password),
      },
      {
        label: "Contains special character",
        met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      },
    ];
  }, [password]);

  const isPasswordStrong = useMemo(() => {
    return passwordRequirements.length > 0 && passwordRequirements.every((req) => req.met);
  }, [passwordRequirements]);

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
    if (!isPasswordStrong) {
      isValid = false;
    }
    return isValid;
  }

  async function onSubmit() {
    setLoading(true);

    if (validateForm()) {
      const { success, error } = await updatePassword(password);
      if (error) {
        showToast("Failed to update password", error, false);
      } else {
        showToast("Successfully updated password");
        redirect();
      }
    } else {
      if (!isPasswordStrong) {
        showToast("Password too weak", "Please meet all password requirements", false);
      } else if (password !== confirmedPassword) {
        showToast("Passwords don't match", "Please ensure both passwords are identical", false);
      } else {
        showToast("Please fill in all fields", "", false);
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
                Choose New Password
              </Heading>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                Use the password strength checklist to ensure your password meets all the requirements.
              </Text>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    p="4"
                  />
                  {password === "" && <FormErrorMessage>Password is required</FormErrorMessage>}
                </FormControl>
                {/* Confirmed password */}
                <FormControl
                  isInvalid={
                    confirmedPassword !== "" && password !== confirmedPassword
                  }
                >
                  <FormLabel fontSize={"md"} htmlFor="confirmedPassword">
                    Confirm Password
                  </FormLabel>
                  <Input
                    id="confirmedPassword"
                    type="password"
                    isRequired={true}
                    value={confirmedPassword}
                    onChange={(e) => setConfirmedPassword(e.target.value)}
                    p="4"
                  />
                  {confirmedPassword !== "" && password !== confirmedPassword && (
                    <FormErrorMessage>Passwords must match</FormErrorMessage>
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
                  Set New Password
                </Button>
              </Stack>
            </Stack>
          </Box>
          <Box bg="gray.50" borderRadius="xl" p={{ base: 6, md: 8 }} display="flex" flexDirection="column" justifyContent="flex-start">
            <Stack spacing={{ base: 6, md: 8 }}>
              <Box>
                <Heading size="md" color="gray.700" mb={3}>
                  Password Strength Checklist
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Your password must meet all of these requirements to keep your account secure.
                </Text>
              </Box>
              <Box bg="white" borderRadius="xl" p={{ base: 6, md: 8 }} boxShadow="sm">
                <List spacing={3} color="gray.600" fontSize="md">
                  {passwordRequirements.map((requirement, index) => (
                    <ListItem key={index}>
                      <ListIcon
                        as={requirement.met ? CheckCircleIcon : CloseIcon}
                        color={requirement.met ? "green.500" : "gray.300"}
                      />
                      <Text
                        as="span"
                        color={requirement.met ? "gray.700" : "gray.400"}
                        textDecoration={requirement.met ? "none" : "none"}
                      >
                        {requirement.label}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box>
                <Heading size="sm" color="gray.700" mb={3}>
                  Security tips
                </Heading>
                <List spacing={2} color="gray.600" fontSize="sm">
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="blue.500" />
                    Use a unique password that you don't use elsewhere
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="blue.500" />
                    Never share your password with anyone
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="blue.500" />
                    Consider using a password manager
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
