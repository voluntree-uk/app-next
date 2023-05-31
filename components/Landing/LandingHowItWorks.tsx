import { Button, Flex, Heading, Text, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import LandingHowItWorksCard from "./LandingHowItWorksCard";

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
    title: "Host",
    description:
      "Volunteers are an integral part of the platform: they're the ones that volunteer their skills and time to the community.",
    img: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
  },
];

export default function LandingHowItWorks() {
  const router = useRouter();

  return (
    <Flex flexDir={"column"} alignItems="center" gap={25}>
      <Flex alignItems={"center"} flexDir={"column"}>
        <Heading fontWeight={"bold"} size="lg" pb="3">
          How Share works
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
      <Button onClick={() => router.push("/workshops")} colorScheme={"green"}>
        Find workshops
      </Button>
    </Flex>
  );
}
