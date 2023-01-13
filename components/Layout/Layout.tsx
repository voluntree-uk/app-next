import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import Footer from "../Footer";
import Navbar from "./Navbar";
import ResponsiveContainer from "./ResponsiveContainer";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout(props: LayoutProps) {
  const router = useRouter();

  const bg = {
    "/": "purple.50",
    "/workshops": "gray.50",
    "/workshops/[wid]": "blue.50",
  };

  return (
    <Box
      minH={"100vh"}
      display="flex"
      flexDir={"column"}
      justifyContent="space-between"
      bg={(bg as any)[router.route]}
    >
      <Box zIndex={"50000"}>
        <Navbar />
        <ResponsiveContainer>{props.children}</ResponsiveContainer>
      </Box>
      <Footer />
    </Box>
  );
}
