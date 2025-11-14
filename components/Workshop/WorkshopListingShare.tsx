"use client";

import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import { Workshop } from "@schemas";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon
} from "react-share";

interface IProps {
  workshop: Workshop;
}

export default function WorkshopListingShare({ workshop }: IProps) {
  const [host, setHost] = useState<null|string>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.origin);
    }
  }, [setHost]);

  const shareUrl = `${host}/workshops/${workshop.id}`;
  const title = `Checkout this free workshop at Voluntree - ${workshop.name}: `;
  
  return (
    <Box>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        gap={4}
      >
        <Box>
          <Heading as="h2" size="lg" color="gray.700" mb={2}>
            Share This Workshop
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Help spread the word about this workshop
          </Text>
        </Box>
        <HStack spacing={3}>
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={title}>
            <XIcon size={40} round />
          </TwitterShareButton>
          <LinkedinShareButton
            url={shareUrl}
            title={title}
            summary={workshop.description}
          >
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
          <WhatsappShareButton url={shareUrl} title={title}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
        </HStack>
      </Flex>
    </Box>
  );
}
