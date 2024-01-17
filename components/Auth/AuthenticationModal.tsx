
import React from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import AuthenticationForm from "@components/Auth/AuthenticationForm";

interface IProps {
  isOpen: boolean;
  onClose(): void;
}

export default function AuthenticationModal({ isOpen, onClose }: IProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", sm: "xl" }}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <AuthenticationForm onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
