"use client";

import * as React from "react";
import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import AuthenticationLogin from "@components/Login/AuthenticationLogin";
import AuthenticationSignUp from "@components/Login/AuthenticationSignUp";

interface IProps {
  signUp(
    email: string,
    password: string
  ): Promise<{ success: boolean; error: string | undefined }>;
  signIn(
    email: string,
    password: string
  ): Promise<{ success: boolean; error: string | undefined }>;
  resetPassword(
    email: string
  ): Promise<{ success: boolean; error: string | undefined }>;
}

export default function AuthenticationForm({
  signUp,
  signIn,
  resetPassword,
}: IProps) {
  return (
    <Container
      maxW="lg"
      py={{ base: "12", sm: "10" }}
      px={{ base: "0", sm: "8" }}
    >
      <Tabs
        variant="enclosed-colored"
        colorScheme="blue"
        isFitted
        borderRadius="xl"
        bg="white"
        boxShadow="lg"
        p={{ base: 4, sm: 6 }}
      >
        <TabList mb={4}>
          <Tab fontWeight="semibold">Log in</Tab>
          <Tab fontWeight="semibold">Sign up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <AuthenticationLogin
              signIn={signIn}
              resetPassword={resetPassword}
            />
          </TabPanel>
          <TabPanel px={0}>
            <AuthenticationSignUp signUp={signUp} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

