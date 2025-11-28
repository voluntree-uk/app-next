"use client";

import {
  Box,
  Heading,
  HStack,
  Img,
  Stack,
  Text,
} from "@chakra-ui/react";
import ValueList from "@components/About/ValueList";
import TeamGrid from "@components/About/TeamGrid";
import MeetingCountdown from "@components/About/MeetingCountdown";
import { AboutValue, TeamMember } from "@schemas";

const values: AboutValue[] = [
  {
    key: "trust",
    name: "Trust",
    description:
      "We earn trust through reliability, openness, and care. We follow through on commitments, welcome honest feedback, and create a space where people feel safe to learn, share, and ask questions.",
  },
  {
    key: "mutual-aid",
    name: "Mutual Aid",
    description:
      "We believe in neighbours supporting neighbours. Our platform makes sharing simple: people pass on what they know so others can benefit, creating a cycle of generosity that strengthens whole communities.",
  },
  {
    key: "transparency",
    name: "Transparency",
    description:
      "Everything we do is in the open, from attendance numbers, to donations, to decision-making. Anyone can see how resources are used, join our meetings, and help shape the future of Voluntree.",
  },
  {
    key: "empowerment",
    name: "Empowerment",
    description:
      "We make it easy for people to step forward, contribute their knowledge, build confidence, and collaborate. Everyone is encouraged to take part, share ideas, ask questions, and grow alongside their community.",
  },
];

const team: TeamMember[] = [
  {
    name: "Mihajlo Milosavljevic",
    role: "Founder & Software Developer",
    imageUrl: `${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/team/mihajlo.jpeg`,
  },
  {
    name: "Calum Sims",
    role: "Co-Founder & Outreach Coordinator",
    imageUrl: `${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/team/calum.jpeg`,
  },
  {
    name: "Sara Ilic",
    role: "Front-end Developer",
    imageUrl: `${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/team/sara.jpeg`,
  },
  {
    name: "Tamara Kostic",
    role: "Social Media Manager",
    imageUrl: `${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/team/tamara.jpeg`,
  },
  {
    name: "Harry Davis",
    role: "Software Developer",
    imageUrl: `${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/team/harry.jpeg`,
  },
  {
    name: "Jovan Drezgic",
    role: "Digital Marketing Specialist",
    imageUrl: `${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/team/jovan.jpeg`,
  },
];

const SectionHeader = ({ text }: { text: string }) => {
  return (
    <Heading
      as="h2"
      fontSize={{ base: "2xl", md: "3xl" }}
      fontWeight="bold"
      color="gray.900"
    >
      {text}
    </Heading>
  );
};

export default function AboutPage({ meetLink }: { meetLink?: string }) {
  return (
    <Stack spacing={{ base: 12, md: 16 }}>
      {/* Hero */}
      <Stack spacing={6}>
        <Heading
          as="h1"
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="extrabold"
          letterSpacing="tight"
          lineHeight="shorter"
          color="gray.900"
        >
          Building a culture of everyday mutual aid.
        </Heading>
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          color="gray.700"
          lineHeight="tall"
          maxW="3xl"
        >
          Voluntree is a volunteer-run platform where people share skills,
          knowledge, and support through free workshops. We're here to make
          learning and helping one another simple, open, and accessible,
          building a movement where mutual support becomes a normal, joyful part
          of daily life.
        </Text>
      </Stack>

      {/* Mission & values */}
      <Stack spacing={{ base: 8, md: 12 }}>
        <HStack
          spacing={8}
          alignItems="start"
          flexDir={{ base: "column", md: "row" }}
        >
          <Stack spacing={5}>
            <SectionHeader text="Mission" />
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.700"
              lineHeight="tall"
            >
              Our mission is to support communities in empowering themselves and
              each other, freely, openly, and without barriers. Anyone can host
              and anyone can learn, because we believe that everyone has
              something valuable to offer. By making knowledge-sharing simple,
              welcoming, and transparent, we help people connect, grow, and
              create real impact together.
            </Text>
          </Stack>
          <Img
            height={{ base: "15em", lg: "20em" }}
            src={`${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/unity.jpg`}
          ></Img>
        </HStack>

        <Stack spacing={5}>
          <SectionHeader text="Values" />
          <ValueList values={values} />
        </Stack>
      </Stack>

      {/* Team */}
      <Stack spacing={{ base: 8, md: 10 }}>
        <Stack spacing={5} mt={{ base: 4, md: 6 }}>
          <SectionHeader text="Team" />
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.700"
            lineHeight="tall"
            maxW="3xl"
          >
            Voluntree started as a small group of people who believed everyday
            acts of help should be easier. Today, the platform is shaped by
            volunteers who share their skills, host workshops, and help run the
            organisation.
          </Text>
          <TeamGrid team={team} />
        </Stack>
        {/* Bi-weekly meeting */}
        {meetLink && (
          <Box mt={{ base: 6, md: 8 }}>
            <MeetingCountdown meetLink={meetLink} />
          </Box>
        )}
      </Stack>
    </Stack>
  );
}


