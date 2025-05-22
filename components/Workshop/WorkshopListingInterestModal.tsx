"use client";

import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { BsEmojiHeartEyes } from "react-icons/bs";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function WorkshopListingInterestModal({
  isOpen,
  onClose,
  onSubmit,
}: IProps) {
  const expressInterestText: string = `You can still express interest in this workshop even if there are no available sessions. We will notify the host and they might schedule new ones.`;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Show interest</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text
              whiteSpace={"pre-wrap"}
              color={"gray.600"}
              fontSize={"14px"}
              lineHeight="6"
              w="100%"
            >
              {expressInterestText}
            </Text>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button
              rounded="full"
              colorScheme="blue"
              variant="outline"
              onClick={() => onSubmit()}
              rightIcon={<BsEmojiHeartEyes />}
              size={{ base: "sm", sm: "md" }}
              m="3"
            >
              Show interest
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
