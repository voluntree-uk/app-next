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
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="lg">
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
          Privacy Settings
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />
        <ModalBody py={6}>
          <Stack spacing={5}>
            <FormControl>
              <Checkbox
                defaultChecked={fullNameConsent}
                size="lg"
                colorScheme="blue"
                id={"fullNameConsent"}
                onChange={(e) => {
                  setFullNameConsent(e.target.checked);
                }}
                spacing={3}
              >
                <Stack spacing={1}>
                  <span style={{ fontWeight: 600, fontSize: "15px" }}>
                    Publicly display full name
                  </span>
                  <span style={{ fontSize: "13px", color: "#718096" }}>
                    Show your full name on your public profile
                  </span>
                </Stack>
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox
                defaultChecked={emailConsent}
                size="lg"
                colorScheme="blue"
                id={"emailConsent"}
                onChange={(e) => {
                  setEmailConsent(e.target.checked);
                }}
                spacing={3}
              >
                <Stack spacing={1}>
                  <span style={{ fontWeight: 600, fontSize: "15px" }}>
                    Publicly display email address
                  </span>
                  <span style={{ fontSize: "13px", color: "#718096" }}>
                    Make your email visible to other users
                  </span>
                </Stack>
              </Checkbox>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor="gray.200" gap={3}>
          <Button
            variant="ghost"
            onClick={() => {
              setFullNameConsent(profile.share_full_name_consent);
              setEmailConsent(profile.share_email_consent);
              onClose();
            }}
            borderRadius="lg"
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              profile.share_email_consent = emailConsent;
              profile.share_full_name_consent = fullNameConsent;
              onSubmit(profile);
              onClose();
            }}
            borderRadius="lg"
            px={8}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
