"use client"

import React, { ReactNode } from "react";
import { Box, useDisclosure } from "@chakra-ui/react";
import Footer from "@components/Footer";
import Navbar from "@components/Layout/Navbar";
import ResponsiveContainer from "@components/Layout/ResponsiveContainer";
import CookieConsent from "@components/Layout/CookieConsent";
import { User } from "@supabase/supabase-js";
import { Profile } from "@schemas";

type LayoutProps = {
  user: User | null;
  profile: Profile | null;
  children: ReactNode;
};

export default function Layout(props: LayoutProps) {
  const {
    isOpen: isCookieConsentOpen,
    onOpen: onCookieConsentOpen,
    onClose: onCookieConsentClose
  } = useDisclosure();
  return (
    <Box
      minH={"100vh"}
      display="flex"
      flexDir={"column"}
      justifyContent="space-between"
    >
      <Box>
        <Navbar user={props.user} profile={props.profile}/>
        <ResponsiveContainer>{props.children}</ResponsiveContainer>
        <CookieConsent
          isOpen={isCookieConsentOpen}
          onOpen={onCookieConsentOpen}
          onClose={onCookieConsentClose}
        />
      </Box>
      <Footer openCookieConsent={onCookieConsentOpen} />
    </Box>
  );
}
