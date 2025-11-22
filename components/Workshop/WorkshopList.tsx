"use client"

import { useRouter } from "next/navigation";
import { Box, Heading, Text, SimpleGrid, Container } from "@chakra-ui/react";
import { WorkshopListItem, FilterProps } from "@schemas";
import WorkshopCard from "@components/Workshop/WorkshopListCard";
import WorkshopListFilter from "@components/Workshop/WorkshopListFilter";
import Show from "@components/Helpers/Show";
import NoResults from "@components/NoResults";
import NextLink from "next/link";
import { Button } from "@chakra-ui/react";

interface IProps {
  workshops: WorkshopListItem[];
  initialFilters: FilterProps;
}

export default function WorkshopList({ workshops, initialFilters }: IProps) {
  const router = useRouter();

  const navigateToWorkshop = (workshopId: string) => {
    router.push(`/workshops/${workshopId}`);
  };

  return (
    <Container p={{ base: "6", sm: "0" }} maxW={"7xl"}>
      <Box mb={{ base: 8, md: 10 }}>
        <Heading
          size={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          mb={3}
          color="gray.700"
        >
          Discover Workshops
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" mb={6}>
          Find workshops to learn from or share your passion with the community. Join sessions that fit your schedule and interests.
        </Text>
        <Box mb={8}>
          <Button
            as={NextLink}
            href="/workshops/new"
            colorScheme="blue"
            size={{ base: "md", md: "lg" }}
          >
            Create Your Workshop
          </Button>
        </Box>
        <WorkshopListFilter initialFilters={initialFilters} />
      </Box>
      <>
        <Show showIf={workshops.length > 0}>
          <Box mb={4}>
            <Text fontSize="sm" color="gray.600">
              Showing {workshops.length} {workshops.length === 1 ? "workshop" : "workshops"}
            </Text>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {workshops.map((item) => (
              <WorkshopCard
                key={item.workshop.id}
                item={item}
                navigate={navigateToWorkshop}
              />
            ))}
          </SimpleGrid>
        </Show>
        <Show showIf={workshops.length === 0}>
          <NoResults message="No workshops found matching your criteria" />
        </Show>
      </>
    </Container>
  );
}
