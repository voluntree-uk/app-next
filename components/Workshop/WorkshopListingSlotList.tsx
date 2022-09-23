import { Box } from "@chakra-ui/react";
import React from "react";
import { Slot } from "../../shared/schemas";
import WorkshopListingSlot from "./WorkshopListingSlot";

interface IProps {
  slots: Slot[];
}

export default function WorkshopListingSlotList({ slots }: IProps) {
  return (
    <Box>
      {slots.map((slot) => (
        <WorkshopListingSlot key={slot.id} slot={slot} />
      ))}
    </Box>
  );
}
