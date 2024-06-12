"use client";
import {
  HStack,
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { setCookie, hasCookie, getCookie } from "cookies-next";
import NextLink from 'next/link';
import { useEffect, useRef, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useRouter } from "next/navigation";


export default function CookieConsent() {
  const analyticsConsent = "analytics-consent";
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!hasCookie(analyticsConsent)) {
      setConsent(true);
      onOpen();
    }
  }, [consent]);

  const acceptConsent = () => {
    setCookie(analyticsConsent, "true");
    onClose();
    router.refresh();
  };

  const rejectConsent = () => {
    setCookie(analyticsConsent, "false");
    onClose();
    router.refresh();
  };

  if (getCookie(analyticsConsent) === "true") {
    return (
      <GoogleAnalytics
        gaId={`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID}`}
      />
    );
  }

  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      size={"xl"}
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Help us improve Voluntree?</ModalHeader>
        <ModalBody>
          <Text pb={"1em"}>
            It's important to understand how companies use your data! If you
            want more info about our practises, see our{" "}
            <Link
              color={"blue"}
              as={NextLink}
              target="_blank"
              href={process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL}
            >
              Privacy Policy
            </Link>
            .
          </Text>
          <HStack>
            <Box>
              <Text as={"b"}>Analytics</Text>
              <Text>
                We are trying to make the most impactful platform we can!
                Analytics help us understand how you use the platform so we
                can improve it.
              </Text>
            </Box>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={"1em"}>
            <Button colorScheme={"teal"} onClick={acceptConsent}>
              Accept
            </Button>
            <Button
              colorScheme={"blackAlpha"}
              variant={"outline"}
              onClick={rejectConsent}
            >
              Essential Only
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
