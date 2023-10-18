import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import Footer from "@components/Footer";
import Navbar from "@components/Layout/Navbar";
import ResponsiveContainer from "@components/Layout/ResponsiveContainer";

type LayoutProps = {
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
        <Navbar />
        <ResponsiveContainer>{props.children}</ResponsiveContainer>
      </Box>
      <Footer />
    </Box>
  );
}
