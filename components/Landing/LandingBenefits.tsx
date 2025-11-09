import { Box, Heading, Text, SimpleGrid, Card, CardBody, Stack, Icon, Flex } from "@chakra-ui/react";
import { BiSmile, BiTimeFive, BiTrendingUp, BiGlobe } from "react-icons/bi";

const benefits = [
  {
    title: "Sharing made simple",
    description: "You don't need to be a teacher to get involved. Share a hobby, story, or skill in the way that feels natural to you.",
    icon: BiSmile,
    accent: "teal",
  },
  {
    title: "Fits around real life",
    description: "Choose the topics, dates, and format that work for your schedule—online or in person, one-off or recurring.",
    icon: BiTimeFive,
    accent: "blue",
  },
  {
    title: "Grow while giving",
    description: "Swap knowledge, meet new people, and build confidence as you exchange experiences with others.",
    icon: BiTrendingUp,
    accent: "purple",
  },
  {
    title: "Community-first",
    description: "Every session keeps practical know-how circulating locally and helps create a more connected community.",
    icon: BiGlobe,
    accent: "orange",
  },
];

const missionStatement = `Voluntree is a UK-wide community where people swap skills, stories, and support. Our mission is to make sharing effortless—because when everyone feels welcome to contribute, we build stronger, more confident communities together.`;

export default function LandingBenefits() {
  return (
    <Box bg="gray.50" borderRadius="lg" p={{ base: 6, md: 10 }} mb={{ base: 12, md: 16 }}>
      <Stack spacing={{ base: 6, md: 8 }}>
        <Box>
          <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mb={3}>
            Why people share on Voluntree
          </Heading>
          <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
            {missionStatement}
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 4, md: 6 }}>
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              bg="white"
              borderRadius="lg"
              shadow="md"
              h="100%"
              borderTopWidth="4px"
              borderTopColor={`${benefit.accent}.400`
              }
              transition="all 0.2s ease"
              _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
            >
              <CardBody display="flex" flexDirection="column" gap={4}>
                <Flex
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  bg={`${benefit.accent}.100`}
                  color={`${benefit.accent}.500`}
                >
                  <Icon as={benefit.icon} boxSize="24px" />
                </Flex>
                <Heading fontSize={{ base: "lg", md: "xl" }} letterSpacing="tight">
                  {benefit.title}
                </Heading>
                <Text color="gray.600" fontSize="sm" lineHeight="tall">
                  {benefit.description}
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
