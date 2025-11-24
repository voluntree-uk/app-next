import {
  Avatar,
  Box,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
}

interface TeamGridProps {
  team: TeamMember[];
}

export default function TeamGrid({ team }: TeamGridProps) {
  if (!team.length) {
    return (
      <Box borderWidth="1px" borderRadius="lg" p={6} borderColor="gray.200">
        <Text color="gray.600">
          Voluntree is powered by volunteers from different backgrounds and
          communities. We&apos;ll be sharing more about the people behind the
          platform soon.
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 6, md: 8 }}>
      {team.map((member) => (
        <Stack
          key={member.name}
          spacing={3}
          borderWidth="1px"
          borderRadius="lg"
          borderColor="gray.200"
          p={5}
          align="flex-start"
          bg="white"
        >
          <Avatar
            name={member.name}
            src={member.imageUrl}
            size="lg"
          />
          <Box>
            <Heading fontSize="lg" mb={1}>
              {member.name}
            </Heading>
            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
              {member.role}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {member.bio}
            </Text>
          </Box>
        </Stack>
      ))}
    </SimpleGrid>
  );
}


