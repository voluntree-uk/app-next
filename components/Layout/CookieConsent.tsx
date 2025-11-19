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
} from "@chakra-ui/react";
import { setCookie, hasCookie, getCookie } from "cookies-next";
import NextLink from 'next/link';
import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useRouter } from "next/navigation";


export default function CookieConsent({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const analyticsConsent = "analytics-consent";
  const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
  const ONE_MONTH_SECONDS = 60 * 60 * 24 * 30;
  const router = useRouter();

  useEffect(() => {
    if (!hasCookie(analyticsConsent)) {
      onOpen();
    }
  }, [analyticsConsent, onOpen]);


  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID &&
      getCookie(analyticsConsent) == "true"
    ) {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.init(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID!);
          ReactPixel.pageView();
        });
    }
  }, []);

  const acceptConsent = () => {
    setCookie(analyticsConsent, "true", {
      maxAge: ONE_YEAR_SECONDS,
    });
    onClose();
    router.refresh();
  };

  const rejectConsent = () => {
    setCookie(analyticsConsent, "false", {
      maxAge: ONE_MONTH_SECONDS,
    });
    onClose();
    router.refresh();
  };

  return (
    <>
      {getCookie(analyticsConsent) === "true" && (
        <GoogleAnalytics
          gaId={`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID}`}
        />
      )}
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
            <Text>
              It's important to understand how companies use your data!
            </Text>
            <Text pb={"1em"}>
              If you want more info about our practises, see our{" "}
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
                <Text>All analytic data is anonymous.</Text>
              </Box>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={"1em"}>
              <Button colorScheme={"teal"} onClick={acceptConsent}>
                Accept Analytics
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
    </>
  );
};
