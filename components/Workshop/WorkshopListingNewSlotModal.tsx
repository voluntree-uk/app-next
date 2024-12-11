"use client";

import React, { useState } from "react";
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
import { dateAsISOString, endOfNextWeekAsISOString } from "@util/dates";

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

  const [date, setDate] = useState<string>(endOfNextWeekAsISOString());
  const [startTime, setStartTime] = useState<string>("17:00");
  const [endTime, setEndTime] = useState<string>("18:00");
  const [capacity, setCapacity] = useState<number>(1);
  
  function validateForm(): boolean {
    var isValid = true;
    if (!date) {
      setDate("");
      isValid = false;
    }
    if (!startTime) {
      setStartTime("");
      isValid = false;
    }
    if (!endTime) {
      setEndTime("");
      isValid = false;
    }
    if (capacity < 1) {
      setCapacity(0);
      isValid = false;
    }
    return isValid;
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Session</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="3">
            {/* Date */}
            <FormControl isInvalid={!date} mr={1}>
              <FormLabel htmlFor="date" fontSize={{ base: "xs", sm: "sm" }}>
                Date
              </FormLabel>
              <Input
                id="date"
                placeholder="Date"
                type="date"
                defaultValue={date}
                min={dateAsISOString()}
                onChange={(e) => setDate(e.target.value)}
              />
              <FormErrorMessage>Date is required</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!startTime} mr={1}>
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
                defaultValue={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <FormErrorMessage>Start time is required</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!endTime}>
              <FormLabel htmlFor="endTime" fontSize={{ base: "xs", sm: "sm" }}>
                End Time
              </FormLabel>
              <Input
                id="endTime"
                placeholder="End Time"
                type="time"
                defaultValue={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <FormErrorMessage>End time is required</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={capacity < 1}>
              <FormLabel htmlFor="capacity" fontSize={{ base: "xs", sm: "sm" }}>
                Capacity
              </FormLabel>
              <Input
                id="capacity"
                placeholder="Capacity"
                type="number"
                defaultValue={capacity}
                onChange={(e) =>
                  e.target.value
                    ? setCapacity(Number.parseInt(e.target.value))
                    : setCapacity(0)
                }
              />
              <FormErrorMessage>Capacity is required</FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={() => {
              if (validateForm()) {
                onSubmit({
                  workshop_id: workshop.id!,
                  date: date,
                  start_time: startTime,
                  end_time: endTime,
                  capacity: capacity,
                });
              }
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
