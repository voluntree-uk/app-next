"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  HStack,
  VStack,
  Text,
  Avatar,
  Stack,
  Button,
  Icon,
} from "@chakra-ui/react";
import { WorkshopReview, Workshop } from "@schemas";
import { HiStar, HiOutlineStar } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { dateToReadable } from "@util/dates";
import Show from "@components/Helpers/Show";

interface IProps {
  reviews: WorkshopReview[];
  workshop: Workshop;
}

export default function WorkshopListingReviews({ reviews, workshop }: IProps) {
  const [visibleCount, setVisibleCount] = useState(3);

  if (reviews.length === 0) {
    return null;
  }

  // Calculate average rating
  const averageRating =
    reviews.reduce((sum, review) => sum + (review.booking.review_rating || 0), 0) /
    reviews.length;

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = reviews.length > visibleCount;

  const getReviewerDisplayName = (review: WorkshopReview): string => {
    const { reviewer } = review;
    if (reviewer.share_full_name_consent && reviewer.name && reviewer.surname) {
      return `${reviewer.name} ${reviewer.surname}`;
    }
    if (reviewer.name) {
      return reviewer.name;
    }
    if (reviewer.username) {
      return reviewer.username;
    }
    return "A learner";
  };

  const getAvatarUrl = (avatarUrl?: string): string | undefined => {
    if (avatarUrl && avatarUrl !== "default_avatar.png") {
      return `${process.env.NEXT_PUBLIC_S3_STATIC_RESOURCES_BASE_URL}/${avatarUrl}`;
    }
    return undefined;
  };

  return (
    <Box bg="white" borderBottomWidth="1px" borderBottomColor="gray.200">
      <Container maxW="7xl" px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}>
        <VStack align="stretch" spacing={6}>
          {/* Summary */}
          <Box>
            <Heading as="h2" size="lg" color="gray.700" mb={4}>
              Reviews
            </Heading>
            <HStack spacing={2}>
              <HStack spacing={1}>
                <Icon as={HiStar} color="yellow.400" boxSize={5} />
                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                  {averageRating.toFixed(1)}
                </Text>
              </HStack>
              <Text fontSize="md" color="gray.600">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </Text>
            </HStack>
          </Box>

          {/* Reviews List */}
          <Stack spacing={4}>
            {visibleReviews.map((review) => {
              const displayName = getReviewerDisplayName(review);
              const rating = review.booking.review_rating || 0;
              const comment = review.booking.review_comment;
              const slot = review.booking.slot;
              const dateStr = slot
                ? dateToReadable(slot.date, slot.end_time, false)
                : "";

              return (
                <Box
                  key={review.booking.id}
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <HStack align="flex-start" spacing={4}>
                    <Avatar
                      size="md"
                      name={displayName}
                      src={getAvatarUrl(review.reviewer.avatar_url)}
                    />
                    <VStack align="flex-start" spacing={2} flex={1}>
                      <HStack justify="space-between" width="100%">
                        <VStack align="flex-start" spacing={0}>
                          <Text fontWeight="semibold" color="gray.700" fontSize="sm">
                            {displayName}
                          </Text>
                          {dateStr && (
                            <Text fontSize="xs" color="gray.500">
                              {dateStr}
                            </Text>
                          )}
                        </VStack>
                        <HStack spacing={1}>
                          {[1, 2, 3, 4, 5].map((value) => (
                            <Icon
                              key={value}
                              as={value <= rating ? HiStar : HiOutlineStar}
                              boxSize={4}
                              color={value <= rating ? "yellow.400" : "gray.300"}
                            />
                          ))}
                        </HStack>
                      </HStack>
                      <Show showIf={!!comment}>
                        <Text fontSize="sm" color="gray.600" lineHeight="tall">
                          {comment}
                        </Text>
                      </Show>
                    </VStack>
                  </HStack>
                </Box>
              );
            })}
          </Stack>

          {/* Load More Button */}
          <Show showIf={hasMore}>
            <Button
              variant="ghost"
              colorScheme="gray"
              width="100%"
              onClick={() => setVisibleCount((prev) => Math.min(prev + 3, reviews.length))}
              rightIcon={<Icon as={MdKeyboardArrowDown} />}
              color="gray.600"
              _hover={{
                bg: "gray.100",
                color: "gray.700",
              }}
            >
              Load more reviews
            </Button>
          </Show>
        </VStack>
      </Container>
    </Box>
  );
}
