"use client";

import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import ValueList from "@components/About/ValueList";
import TeamGrid from "@components/About/TeamGrid";
import CTAGroup from "@components/shared/CTAGroup";
import MeetingCountdown from "@components/About/MeetingCountdown";
import { AboutValue, EngagementPath, TeamMember, Collaborator } from "@schemas";

interface AboutPageProps {
  volunteerStatement: string;
  transparencyBullets: string[];
  engagementPaths: EngagementPath[];
  team: TeamMember[];
  collaborators: Collaborator[];
  meetLink?: string;
}


const values: AboutValue[] = [
  {
    key: "trust",
    name: "Trust",
    description:
      "We earn trust by providing reliable support to those who need it most.",
  },
  {
    key: "mutual-aid",
    name: "Mutual Aid",
    description:
      "We are here to make sharing simple and accessible for everyone. We believe in neighbours supporting neighbours, sharing what they can so everyone is better off.",
  },
  {
    key: "transparency",
    name: "Transparency",
    description:
      "We are fully transparent about how we work and how we use donations. Anyone can see exactly how we use donations to support the community, and anyone can join our meetings to help shape the future of Voluntree.",
  },
  {
    key: "empowerment",
    name: "Empowerment",
    description:
      "We make it easy for people to share what they know, build confidence, and grow through volunteering.",
  },
];

export default function AboutPage({
  volunteerStatement,
  transparencyBullets,
  engagementPaths,
  team,
  collaborators,
  meetLink,
}: AboutPageProps) {
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
        <Text fontSize={{ base: "lg", md: "xl" }} color="gray.700" lineHeight="tall" maxW="3xl">
          Voluntree is a volunteer-run platform that helps people share skills,
          stories, and support through free community workshops. We're
          building a movement where helping each other becomes a normal part of
          everyday life.
        </Text>
      </Stack>

      <Divider borderColor="gray.300" />

      {/* Mission & values */}
      <Stack spacing={{ base: 8, md: 12 }}>
        <Stack spacing={5} maxW="4xl">
          <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="gray.900">
            Mission
          </Heading>
          <Text fontSize={{ base: "lg", md: "xl" }} color="gray.700" lineHeight="tall">
          Our mission is to be a trusted community partner that empowers people to share their skills and knowledge with others. 
          We believe everyone has something valuable to offer, and we're here to make sharing simple and accessible. By connecting people through learning, we help build stronger, more resilient communities, the foundation of a thriving society.
          </Text>
        </Stack>

        <Stack spacing={5}>
          <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="gray.900">
            Values
          </Heading>
          <ValueList values={values} />
        </Stack>
      </Stack>

      <Divider borderColor="gray.300" />

      {/* How we work & The people behind Voluntree - Combined */}
      <Stack spacing={{ base: 8, md: 10 }}>
        <Stack spacing={4}>
          <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="gray.900">
            How we work: fully volunteer-run and transparent
          </Heading>
          <Stack spacing={3} maxW="3xl">
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.700" lineHeight="tall">
              {volunteerStatement}
            </Text>
            <HStack spacing={4} flexWrap="wrap" fontSize="sm" color="gray.600">
              <Text>✓ No salaries or fees</Text>
              <Text>✓ Fully transparent</Text>
              <Text>✓ Community-owned</Text>
            </HStack>
          </Stack>
        </Stack>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 6, md: 8 }}
        >
          <Box 
            borderWidth="1px" 
            borderRadius="xl" 
            p={{ base: 6, md: 7 }}
            borderColor="gray.200"
            bg="white"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
            transition="all 0.2s"
          >
            <Heading
              as="h3"
              fontSize={{ base: "lg", md: "xl" }}
              mb={4}
              fontWeight="semibold"
              color="gray.900"
            >
              What this means in practice
            </Heading>
            <UnorderedList spacing={3} color="gray.700">
              {transparencyBullets.map((item) => (
                <ListItem key={item} fontSize={{ base: "sm", md: "md" }} lineHeight="tall">
                  {item}
                </ListItem>
              ))}
            </UnorderedList>
          </Box>

          <Box
            borderWidth="2px"
            borderRadius="xl"
            p={{ base: 6, md: 7 }}
            borderColor="blue.200"
            bg="blue.50"
            boxShadow="sm"
          >
            <Heading
              as="h3"
              fontSize={{ base: "lg", md: "xl" }}
              mb={4}
              fontWeight="semibold"
              color="blue.900"
            >
              See every pound in and out
            </Heading>
            <Stack spacing={4}>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.800" lineHeight="tall">
                We publish every transaction made through Voluntree so you can
                see exactly how donations are used. If you ever have questions,
                we want you to ask them.
              </Text>
              <Box>
                <Button
                  as={NextLink}
                  href="/finances"
                  colorScheme="blue"
                  size={{ base: "sm", md: "md" }}
                >
                  Explore our finances
                </Button>
              </Box>
            </Stack>
          </Box>
        </SimpleGrid>

        {/* Bi-weekly meeting */}
        {meetLink && (
          <Box mt={{ base: 6, md: 8 }}>
            <MeetingCountdown meetLink={meetLink} />
          </Box>
        )}

        <Stack spacing={5} mt={{ base: 4, md: 6 }}>
          <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="gray.900">
            The people behind Voluntree
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.700" lineHeight="tall" maxW="3xl">
            Voluntree started as a small group of people who believed everyday
            acts of help should be easier. Today, the platform is shaped by
            volunteers who share their skills, host workshops, and help run the
            organisation.
          </Text>
          <TeamGrid team={team} />
        </Stack>

        {collaborators.length > 0 && (
          <Stack spacing={4} mt={4}>
            <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="gray.900">
              Collaborators & supporters
            </Heading>
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3 }}
              spacing={{ base: 4, md: 6 }}
            >
              {collaborators.map((collaborator) => (
                <Box
                  key={collaborator.name}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={5}
                  borderColor="gray.200"
                  bg="white"
                  boxShadow="sm"
                  _hover={{ boxShadow: "md" }}
                  transition="all 0.2s"
                >
                  <Heading fontSize="md" mb={2} fontWeight="semibold" color="gray.900">
                    {collaborator.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" lineHeight="tall">
                    {collaborator.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>

      <Divider borderColor="gray.300" />

      {/* Ways to join - Moved after building trust */}
      <CTAGroup
        title="Choose how you join the movement"
        description="Now that you know how we work and who we are, here&apos;s how you can be part of building stronger communities. There isn&apos;t one right way — whether you want to learn, host, help run the platform, or donate, you&apos;re welcome."
        items={engagementPaths}
      />

      <Divider borderColor="gray.300" />

      {/* Final CTA */}
      <Box
        bgGradient="linear(to-r, blue.600, blue.500)"
        borderRadius="xl"
        p={{ base: 8, md: 10 }}
        color="white"
        boxShadow="lg"
      >
        <Stack spacing={5} maxW="2xl">
          <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
            Ready to help someone take their next step?
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="whiteAlpha.900" lineHeight="tall">
            However you choose to join — learning, hosting, donating, or helping
            behind the scenes — you&apos;re part of building a more generous,
            resilient community.
          </Text>
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={4}
            pt={2}
          >
            <Button
              as={NextLink}
              href="/workshops"
              colorScheme="whiteAlpha"
              bg="white"
              color="blue.600"
              size={{ base: "md", md: "lg" }}
              _hover={{ bg: "whiteAlpha.900" }}
              fontWeight="semibold"
            >
              Find a workshop
            </Button>
            <Button
              as={NextLink}
              href="/workshops/new"
              variant="outline"
              colorScheme="whiteAlpha"
              borderColor="white"
              color="white"
              size={{ base: "md", md: "lg" }}
              _hover={{ bg: "whiteAlpha.200" }}
              fontWeight="semibold"
            >
              Host a workshop
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}


