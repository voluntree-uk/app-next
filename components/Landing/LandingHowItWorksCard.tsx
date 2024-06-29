"use client";

import { Text, Link, Stack, Heading, Button } from "@chakra-ui/react";
import NextLink from "next/link";

interface IProps {
  btn: {
    target: string;
    inNewTab: boolean
    text: string;
    colorScheme: string;
  };
  title: string;
  description: string;
}

export default function LandingHowItWorksCard({
  btn,
  title,
  description,
}: IProps) {
  return (
    <Stack spacing={"1em"}>
      <Heading
        textAlign={{ base: "center", lg: "start" }}
        fontWeight={"bold"}
        size="lg"
        pb="3"
      >
        {title}
      </Heading>
      <Text>{description}</Text>
      <Link
        as={NextLink}
        href={btn.target}
        target={btn.inNewTab ? "_blank" : "_self"}
      >
        <Button width={"100%"} colorScheme={btn.colorScheme}>
          {btn.text}
        </Button>
      </Link>
    </Stack>
  );
}
