"use client"

import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import Footer from "@components/Footer";
import Navbar from "@components/Layout/Navbar";
import ResponsiveContainer from "@components/Layout/ResponsiveContainer";
import { User } from "@supabase/supabase-js";

type LayoutProps = {
  user: User | null;
  children: ReactNode;
};

export default function Layout(props: LayoutProps) {
  return (
    <Box
      minH={"100vh"}
      display="flex"
      flexDir={"column"}
      justifyContent="space-between"
    >
      <Box>
        <Navbar user={props.user} />
        <ResponsiveContainer>{props.children}</ResponsiveContainer>
      </Box>
      <Footer />
    </Box>
  );
}
