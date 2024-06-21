"use client";

import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Profile } from "@schemas";

interface IProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profile: Profile) => void;
}

export function UserProfileSettingsModal({
  profile,
  isOpen,
  onClose,
  onSubmit,
}: IProps) {
  const [fullNameConsent, setFullNameConsent] = useState(profile.share_full_name_consent);
  const [emailConsent, setEmailConsent] = useState(profile.share_email_consent);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Profile Settings {`(@${profile.username})`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="3">
            <FormControl>
              <Checkbox
                defaultChecked={fullNameConsent}
                fontSize={"sm"}
                id={"fullNameConsent"}
                onChange={(e) => {
                  setFullNameConsent(e.target.checked);
                }}
              >
                Publicly display full name
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox
                defaultChecked={emailConsent}
                fontSize={"sm"}
                id={"emailConsent"}
                onChange={(e) => {
                  setEmailConsent(e.target.checked);
                }}
              >
                Publicly display email address
              </Checkbox>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={() => {
                profile.share_email_consent = emailConsent;
                profile.share_full_name_consent = fullNameConsent;
                onSubmit(profile);
                onClose();
              }}
            >
              Save
            </Button>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                setFullNameConsent(profile.share_full_name_consent);
                setEmailConsent(profile.share_email_consent);
                onClose();
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
