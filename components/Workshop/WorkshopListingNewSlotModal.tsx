"use client";

import React from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Workshop, Slot } from "@schemas";
import { endOfNextWeekAsISOString } from "@util/dates";

interface IProps {
  workshop: Workshop;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (slot: Slot) => void;
}

export function WorkshopListingNewSlotModal({
  workshop,
  isOpen,
  onClose,
  onSubmit,
}: IProps) {
  let date: string = endOfNextWeekAsISOString();
  let start_time: string = "17:00";
  let end_time: string = "18:00";
  let capacity: number = 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Slot for {workshop.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="3">
            <FormControl isInvalid={!date} mr={1}>
              <FormLabel htmlFor="date" fontSize={{ base: "xs", sm: "sm" }}>
                Date
              </FormLabel>
              <Input
                id="date"
                placeholder="Date"
                type="date"
                defaultValue={date}
                onChange={(e) => (date = e.target.value)}
              />
              <FormErrorMessage>This is required</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!start_time} mr={1}>
              <FormLabel
                htmlFor="startTime"
                fontSize={{ base: "xs", sm: "sm" }}
              >
                Start Time
              </FormLabel>
              <Input
                id="startTime"
                placeholder="Start Time"
                type="time"
                defaultValue={start_time}
                onChange={(e) => (start_time = e.target.value)}
              />
              <FormErrorMessage>This is required</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!end_time}>
              <FormLabel htmlFor="endTime" fontSize={{ base: "xs", sm: "sm" }}>
                End Time
              </FormLabel>
              <Input
                id="endTime"
                placeholder="End Time"
                type="time"
                defaultValue={end_time}
                onChange={(e) => (end_time = e.target.value)}
              />
              <FormErrorMessage>This is required</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!capacity}>
              <FormLabel htmlFor="capacity" fontSize={{ base: "xs", sm: "sm" }}>
                Capacity
              </FormLabel>
              <Input
                id="capacity"
                placeholder="Capacity"
                type="number"
                defaultValue={capacity}
                onChange={(e) => (capacity = Number.parseInt(e.target.value))}
              />
              <FormErrorMessage>This is required</FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={() =>
              onSubmit({
                workshop_id: workshop.id!,
                date: date,
                start_time: start_time,
                end_time: end_time,
                capacity: capacity,
              })
            }
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
