"use client"

import { Link, Heading, Center, Button } from "@chakra-ui/react";
import NextLink from "next/link";

export default function ServerError() {
  return (
    <Center flexDirection={"column"}>
      <Heading size="lg" fontSize="170px">
        500
      </Heading>
      <Heading size="4xl">Internal Server Error</Heading>
      <Link as={NextLink} href="/" color={"blue.500"} pt="2em">
        <Button>Return Home</Button>
      </Link>
    </Center>
  );
}
