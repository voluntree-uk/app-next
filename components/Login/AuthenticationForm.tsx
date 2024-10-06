"use client";

import * as React from "react";
import { Container } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
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
      <Tabs variant="enclosed-colored" colorScheme="green" isFitted>
        <TabList>
          <Tab>Login</Tab>
          <Tab>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AuthenticationLogin
              signIn={signIn}
              resetPassword={resetPassword}
            />
          </TabPanel>
          <TabPanel>
            <AuthenticationSignUp signUp={signUp} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
