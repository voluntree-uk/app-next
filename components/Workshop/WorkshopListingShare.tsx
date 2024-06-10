import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Heading } from "@chakra-ui/react";
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

export default function WorkshopListingDescription({ workshop }: IProps) {
  const [host, setHost] = useState<null|string>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.origin);
    }
  }, [setHost]);

  const shareUrl = `${host}/workshops/${workshop.id}`;
  const title = `Checkout this free workshop at Voluntree - ${workshop.name}: `
  return (
    <Box
      borderBottomWidth={"1px"}
      borderBottomColor="gray.200"
      p="6"
      px={{ base: "6", md: "16" }}
      display="flex"
      justifyContent={"space-between"}
    >
      <Flex alignItems={"center"}>
        <Heading as="h2" size="md" pb="0.5em">
          Share
        </Heading>
      </Flex>
      <Grid templateColumns="repeat(4, 1fr)" gap={"1em"}>
        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={title}>
          <XIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton
          url={shareUrl}
          title={title}
          summary={workshop.description}
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </Grid>
    </Box>
  );
}

