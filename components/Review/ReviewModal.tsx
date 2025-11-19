"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  Textarea,
  VStack,
  HStack,
  Box,
  Heading,
  FormLabel,
  Icon,
} from "@chakra-ui/react";
import { BookingDetails } from "@schemas";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HiOutlineStar, HiStar } from "react-icons/hi";

interface IProps {
  booking: BookingDetails;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: BookingDetails, rating: number, comment: string) => void;
}

export function ReviewModal({ booking, isOpen, onSubmit, onClose }: IProps) {
  const router = useRouter();
  const path = usePathname();
  const query = useSearchParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const onCloseWithRemoveParameter = (): void => {
    query?.get("review");

    const params = new URLSearchParams(query?.toString());
    params.delete("review");

    router.replace(`${path}?${params.toString()}`);
    setRating(5);
    setComment("");
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(booking, rating, comment);
    setRating(5);
    setComment("");
  };

  const labelStyles = {
    mt: "2",
    fontSize: "sm",
    fontWeight: "medium",
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onCloseWithRemoveParameter} size="lg">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" mx={4}>
        <ModalHeader 
          fontSize="2xl" 
          fontWeight="bold" 
          color="gray.800"
          borderBottomWidth="1px"
          borderColor="gray.200"
          pb={4}
        >
          Review Workshop
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" color="gray.700" mb={2} textAlign="center">
                {booking.workshop.name}
              </Heading>
            </Box>

            <Box>
              <FormLabel fontSize="md" fontWeight="semibold" color="gray.700" mb={4}>
                How would you rate this workshop?
              </FormLabel>
              <VStack spacing={3} align="stretch">
                <HStack spacing={2} justify="center" mb={2}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Icon
                      key={value}
                      as={value <= rating ? HiStar : HiOutlineStar}
                      boxSize={8}
                      color={value <= rating ? "yellow.400" : "gray.300"}
                      transition="all 0.2s"
                    />
                  ))}
                  {rating > 0 && (
                    <Text fontSize="lg" fontWeight="bold" color="gray.700" ml={2}>
                      {rating} / 5
                    </Text>
                  )}
                </HStack>
                <Slider
                  value={rating}
                  min={1}
                  max={5}
                  step={1}
                  onChange={(val) => setRating(val)}
                  colorScheme="yellow"
                  focusThumbOnChange={false}
                >
                  <SliderMark value={1} {...labelStyles}>
                    1
                  </SliderMark>
                  <SliderMark value={2} {...labelStyles}>
                    2
                  </SliderMark>
                  <SliderMark value={3} {...labelStyles}>
                    3
                  </SliderMark>
                  <SliderMark value={4} {...labelStyles}>
                    4
                  </SliderMark>
                  <SliderMark value={5} {...labelStyles}>
                    5
                  </SliderMark>
                  <SliderTrack bg="gray.200">
                    <SliderFilledTrack bg="yellow.400" />
                  </SliderTrack>
                  <SliderThumb boxSize={6} borderWidth="2px" borderColor="yellow.400" />
                </Slider>
              </VStack>
            </Box>

            <Box>
              <FormLabel fontSize="md" fontWeight="semibold" color="gray.700" mb={2}>
                Additional comments (optional)
              </FormLabel>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about the workshop..."
                size="md"
                borderRadius="lg"
                borderColor="gray.300"
                _hover={{
                  borderColor: "gray.400",
                }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
                rows={4}
                resize="vertical"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Your feedback helps improve the community experience
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor="gray.200" pt={4}>
          <HStack spacing={3}>
            <Button
              variant="outline"
              onClick={onCloseWithRemoveParameter}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "md",
              }}
              transition="all 0.2s"
            >
              Submit Review
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
