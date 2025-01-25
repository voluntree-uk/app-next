"use client";

import { Text, Link, Heading, Button, Flex, Box } from "@chakra-ui/react";
import NextLink from "next/link";

interface IProps {
  btn: {
    target: string;
    inNewTab: boolean
    text: string;
    background: string;
    hoverColor: string;
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
    <Flex
      direction="column"
      justify="space-betwen"
      align="stretch">
      <Box mb="4">
        <Heading
          textAlign={{ base: "center", lg: "start" }}
          fontWeight={"bold"}
          size="lg"
          pb="3"
        >
          {title}
        </Heading>
        <Text textAlign={"justify"}>{description}</Text>
      </Box>
        <Link
          as={NextLink}
          href={btn.target}
          target={btn.inNewTab ? "_blank" : "_self"}
          mt="auto"
        >
          <Button 
            width={"100%"} 
            background={btn.background} 
            color={"white"} 
            _hover={{background: btn.hoverColor }}
          >
            {btn.text}
          </Button>
        </Link>
    </Flex>
  );
}
