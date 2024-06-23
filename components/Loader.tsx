"use client";

import { VStack, Spinner, Heading } from "@chakra-ui/react";

export default function Loader({
  message,
  fullScreen = false
}: {
  message?: string,
  fullScreen?: boolean
}) {
  
  return (
    <VStack justifyContent={"center"} alignItems={"center"} height={fullScreen ? "80vh" : "20vh"}>
      <Spinner size="xl" />
      {message && <Heading size={"sm"}>{message}</Heading>}
    </VStack>
  );
};
