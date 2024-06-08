"use client";

import React from "react";
import NextLink from "next/link";
import { Img, Card, CardBody, Heading, Link, VStack } from "@chakra-ui/react";
import { Workshop } from "@schemas";

interface IProps {
  workshop: Workshop;
}

export default function HostedWorkshopCard({ workshop }: IProps) {
  return (
    <Link as={NextLink} href={`/workshops/${workshop.id}`}>
      <Card variant="outline" maxW="sm">
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
    </Link>
  );
}
