import { Container, Stack } from "@chakra-ui/react";
import React from "react";
import { Workshop } from "../../shared/schemas";
import WorkshopCard from "./WorkshopListCard";
import WorkshopListFilter from "./WorkshopListFilter";

interface IProps {
  workshops: Workshop[];
  hideFilter?: boolean;
}

export default function WorkshopList(props: IProps) {
  return (
    <Container maxW="container.md">
      {!props.hideFilter ? (
        <WorkshopListFilter onFilterChange={(data) => console.log(data)} />
      ) : null}
      <Stack overflow="scroll">
        {props.workshops.map((w) => (
          <WorkshopCard key={w.id} workshop={w} />
        ))}
      </Stack>
    </Container>
  );
}
