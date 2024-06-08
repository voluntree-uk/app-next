"use client";

import { Button, Flex, Heading, Text, Box } from "@chakra-ui/react";
import LandingHowItWorksCard from "@components/Landing/LandingHowItWorksCard";
import { Link } from "@chakra-ui/next-js";

const howItWorksCardContent = [
  {
    title: "Host",
    description:
      "Volunteers are an integral part of the platform: they're the ones that volunteer their skills and time to the community.",
    img: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
  },
  {
    title: "Join",
    description:
      "Users are the main beneficiaries of the platform: they're the ones receiving the support, knowledge and skills, totally free.",
    img: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
  },
  {
    title: "Support",
    description:
      "Become a sponsor today by donating as little as £1 and help this project grow and improve.",
    img: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
  },
];

export default function LandingHowItWorks() {
  return (
    <Flex flexDir={"column"} alignItems="center" gap={25}>
      <Flex alignItems={"center"} flexDir={"column"}>
        <Heading fontWeight={"bold"} size="lg" pb="3">
          How Voluntree works
        </Heading>
        <Text w={{ base: "100%" }} textAlign="center" fontSize={"md"}>
          Join, host or sponsor community workshops. It’s totally free to create
          an account and always will be.
        </Text>
      </Flex>

      <Flex flexDir={{ base: "column", lg: "row" }} gap={{ base: "10" }}>
        {howItWorksCardContent.map(({ title, description, img }) => (
          <LandingHowItWorksCard
            key={title}
            title={title}
            description={description}
            img={img}
          />
        ))}
      </Flex>
      <Link href={"/workshops"}>
        <Button colorScheme={"green"}>Find workshops</Button>
      </Link>
    </Flex>
  );
}
