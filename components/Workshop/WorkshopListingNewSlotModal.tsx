"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormHelperText,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  HStack,
  Text,
  Box,
  Badge,
} from "@chakra-ui/react";
import { Workshop, Slot } from "@schemas";
import { dateAsISOString } from "@util/dates";

interface IProps {
  workshop: Workshop;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (slot: Slot) => void;
  existingSlots?: Slot[]; // Pass existing slots for smart suggestions
}

interface SlotFormData {
  date: string;
  startTime: string;
  endTime: string;
  capacity: string;
}

export function WorkshopListingNewSlotModal({
  workshop,
  isOpen,
  onClose,
  onSubmit,
  existingSlots = [],
}: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<SlotFormData>({
    mode: "onChange",
  });

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const date = watch("date");

  // Calculate smart suggestions from existing slots
  const getSuggestions = () => {
    if (existingSlots.length === 0) return null;

    const upcomingSlots = existingSlots
      .filter((slot) => {
        const slotDate = new Date(`${slot.date}T${slot.end_time}`);
        return slotDate > new Date();
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.start_time}`);
        const dateB = new Date(`${b.date}T${b.start_time}`);
        return dateB.getTime() - dateA.getTime();
      });

    if (upcomingSlots.length === 0) return null;

    const lastSlot = upcomingSlots[0];
    const capacities = existingSlots.map((s) => s.capacity);
    const avgCapacity = Math.round(
      capacities.reduce((sum, cap) => sum + cap, 0) / capacities.length
    );
    const mostCommonCapacity = capacities.sort(
      (a, b) =>
        capacities.filter((v) => v === a).length -
        capacities.filter((v) => v === b).length
    )[capacities.length - 1];

    return {
      date: lastSlot.date,
      startTime: lastSlot.start_time,
      endTime: lastSlot.end_time,
      capacity: mostCommonCapacity || avgCapacity || 3,
    };
  };

  const suggestions = getSuggestions();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Calculate duration
  const calculateDuration = () => {
    if (!startTime || !endTime) return null;

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) return null;

    const durationMinutes = endMinutes - startMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const duration = calculateDuration();

  const handleUseSuggestion = () => {
    if (suggestions) {
      setValue("date", suggestions.date);
      setValue("startTime", suggestions.startTime);
      setValue("endTime", suggestions.endTime);
      setValue("capacity", suggestions.capacity.toString());
    }
  };

  const onSubmitForm = (data: SlotFormData) => {
    onSubmit({
      workshop_id: workshop.id!,
      date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      capacity: parseInt(data.capacity),
    });
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={{ base: "full", md: "md" }}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <ModalHeader>Create New Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={5}>
              {/* Smart Suggestion */}
              {suggestions && (
                <Box
                  bg="blue.50"
                  borderWidth="1px"
                  borderColor="blue.200"
                  borderRadius="md"
                  p={3}
                >
                  <HStack justify="space-between" align="center">
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="blue.900" mb={1}>
                        Quick fill from last session
                      </Text>
                      <Text fontSize="xs" color="blue.700">
                        {suggestions.date} • {suggestions.startTime} - {suggestions.endTime} • Capacity: {suggestions.capacity}
                      </Text>
                    </Box>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={handleUseSuggestion}
                    >
                      Use
                    </Button>
                  </HStack>
                </Box>
              )}

              {/* Date */}
              <FormControl isInvalid={!!errors.date}>
                <FormLabel htmlFor="date" fontSize="sm" fontWeight="semibold">
                  Date
                </FormLabel>
                <Input
                  id="date"
                  type="date"
                  min={dateAsISOString()}
                  {...register("date", {
                    required: "Please select a date",
                  })}
                  placeholder="Select date"
                />
                {errors.date ? (
                  <FormErrorMessage>{errors.date.message}</FormErrorMessage>
                ) : (
                  <FormHelperText fontSize="xs" color="gray.500">
                    Choose when this session will take place
                  </FormHelperText>
                )}
              </FormControl>

              {/* Time Range */}
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={3}>
                  Time
                </Text>
                <HStack spacing={3} align="flex-start">
                  <Box flex="1">
                    <FormControl isInvalid={!!errors.startTime}>
                      <FormLabel htmlFor="startTime" fontSize="xs" color="gray.600">
                        Start
                      </FormLabel>
                      <Input
                        id="startTime"
                        type="time"
                        {...register("startTime", {
                          required: "Start time is required",
                          validate: (value) => {
                            if (endTime && value >= endTime) {
                              return "Start time must be before end time";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.startTime && (
                        <FormErrorMessage fontSize="xs">
                          {errors.startTime.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>

                  <Box flex="1">
                    <FormControl isInvalid={!!errors.endTime}>
                      <FormLabel htmlFor="endTime" fontSize="xs" color="gray.600">
                        End
                      </FormLabel>
                      <Input
                        id="endTime"
                        type="time"
                        {...register("endTime", {
                          required: "End time is required",
                          validate: (value) => {
                            if (startTime && value <= startTime) {
                              return "End time must be after start time";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.endTime && (
                        <FormErrorMessage fontSize="xs">
                          {errors.endTime.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>
                </HStack>
                {duration && !errors.startTime && !errors.endTime && (
                  <HStack mt={2} spacing={2}>
                    <Badge colorScheme="blue" fontSize="xs">
                      Duration: {duration}
                    </Badge>
                  </HStack>
                )}
                {!errors.startTime && !errors.endTime && (
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {!startTime || !endTime
                      ? "Select start and end times"
                      : duration
                      ? `Session will last ${duration}`
                      : ""}
                  </Text>
                )}
              </Box>

              {/* Capacity */}
              <FormControl isInvalid={!!errors.capacity}>
                <FormLabel htmlFor="capacity" fontSize="sm" fontWeight="semibold">
                  Capacity
                </FormLabel>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  step="1"
                  {...register("capacity", {
                    required: "Capacity is required",
                    min: {
                      value: 1,
                      message: "Capacity must be at least 1",
                    },
                    valueAsNumber: true,
                  })}
                  placeholder="e.g., 5"
                />
                {errors.capacity ? (
                  <FormErrorMessage>{errors.capacity.message}</FormErrorMessage>
                ) : (
                  <FormHelperText fontSize="xs" color="gray.500">
                    Maximum number of learners for this session
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              Create Session
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
