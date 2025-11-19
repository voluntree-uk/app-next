"use client";

import {
  List,
  ListItem,
  ListIcon,
  Text,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";

export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export const buildPasswordRequirements = (
  password: string
): PasswordRequirement[] => {
  return [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "Contains number",
      met: /[0-9]/.test(password),
    },
    {
      label: "Contains special character",
      met: /[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(password),
    },
  ];
};

export const isPasswordStrong = (password: string): boolean => {
  const requirements = buildPasswordRequirements(password);
  return requirements.length > 0 && requirements.every((req) => req.met);
};

export function PasswordStrengthChecklist({ password }: { password: string }) {
  const requirements = buildPasswordRequirements(password);

  return (
    <List spacing={3} color="gray.600" fontSize="sm">
      {requirements.map((requirement, index) => (
        <ListItem key={index}>
          <ListIcon
            as={requirement.met ? CheckCircleIcon : CloseIcon}
            color={requirement.met ? "green.500" : "gray.300"}
          />
          <Text
            as="span"
            color={requirement.met ? "gray.700" : "gray.400"}
          >
            {requirement.label}
          </Text>
        </ListItem>
      ))}
    </List>
  );
}


