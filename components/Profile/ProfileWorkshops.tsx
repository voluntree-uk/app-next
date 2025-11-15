"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { Workshop } from "@schemas";
import { useRouter } from "next/navigation";
import NoHostedWorkshopsFound from "@components/Profile/NoHostedWorkshopsFound";
import Show from "@components/Helpers/Show";

interface IProps {
  workshops: Workshop[];
  isMe: boolean;
}

export default function ProfileWorkshops({ workshops, isMe }: IProps) {
  const router = useRouter();

  const navigateToWorkshop = (id: string) => {
    router.push(`/workshops/${id}`);
  };

  return (
    <Box bg="gray.50" py={{ base: 8, md: 12 }}>
      <Container maxW="7xl" px={{ base: 6, md: 10 }}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg" color="gray.700">
            Workshops
          </Heading>

          <Show showIf={workshops.length > 0}>
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3 }}
              spacing={6}
            >
              {workshops.map((workshop) => (
                <Card
                  key={workshop.id}
                  cursor="pointer"
                  variant="outline"
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  overflow="hidden"
                  _hover={{
                    borderColor: "blue.300",
                    boxShadow: "lg",
                    transform: "translateY(-4px)",
                  }}
                  transition="all 0.2s"
                  onClick={() => navigateToWorkshop(workshop.id!)}
                >
                  <CardBody p={0}>
                    <VStack spacing={0} align="stretch">
                      <Box
                        bg={`url(${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/${workshop.category}_sm.png) center/cover`}
                        h="160px"
                        position="relative"
                      >
                        <Badge
                          position="absolute"
                          top={3}
                          left={3}
                          colorScheme="blue"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                          textTransform="capitalize"
                        >
                          {workshop.category}
                        </Badge>
                      </Box>
                      <Box p={4}>
                        <Heading size="md" color="gray.800" mb={2} noOfLines={2}>
                          {workshop.name}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {workshop.description || "No description available"}
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Show>

          <Show showIf={workshops.length === 0}>
            <NoHostedWorkshopsFound isMe={isMe} />
          </Show>
        </VStack>
      </Container>
    </Box>
  );
}

