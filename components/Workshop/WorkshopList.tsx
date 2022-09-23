import { Container, Stack } from "@chakra-ui/react";
import React from "react";
import { Workshop } from "../../shared/schemas";
import WorkshopCard from "./WorkshopListCard";
import WorkshopListFilter from "./WorkshopListFilter";
import WorkshopListHeading from "./WorkshopListHeading";

interface IProps {
  workshops: Workshop[];
}

export default function WorkshopList(props: IProps) {
  return (
    <Container maxW="container.md">
      <WorkshopListHeading />
      <WorkshopListFilter onFilterChange={(data) => console.log(data)} />
      <Stack overflow="scroll">
        {props.workshops.map((w) => (
          <WorkshopCard key={w.id} workshop={w} />
        ))}
      </Stack>
    </Container>
  );
}
