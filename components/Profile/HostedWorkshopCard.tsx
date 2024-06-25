"use client";

import React from "react";
import { Img, Card, CardBody, Heading, VStack } from "@chakra-ui/react";
import { Workshop } from "@schemas";

interface IProps {
  workshop: Workshop;
  navigate: (id: string) => void;
}

export default function HostedWorkshopCard({ workshop, navigate }: IProps) {
  return (
    <Card
      cursor={"pointer"}
      variant="outline"
      maxW="sm"
      onClick={() => navigate(workshop.id!)}
    >
      <CardBody>
        <VStack>
          <Img
            src={`/img/${workshop.category}.png`}
            alt={workshop.category}
            rounded={"lg"}
            mx="1em"
            height={{ base: "135px", md: "135px" }}
            width={{ base: "225px", md: "225px" }}
          />
          <Heading textAlign={"start"} size="md">
            {workshop.name}
          </Heading>
        </VStack>
      </CardBody>
    </Card>
  );
}
