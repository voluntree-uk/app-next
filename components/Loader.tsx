"use client";

import { VStack, Spinner, Heading } from "@chakra-ui/react";

export default function Loader({
  message
}: {
  message: string|null
}) {
  
  return (
    <VStack justifyContent={"center"} alignItems={"center"} height={"90vh"}>
      <Spinner size="xl" />
      {message && <Heading size={"sm"}>{message}</Heading>}
    </VStack>
  );
};
