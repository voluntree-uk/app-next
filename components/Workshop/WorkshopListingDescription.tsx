"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Button,
  Textarea,
  Container,
  IconButton,
  Tooltip,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { Workshop, User } from "@schemas";
import { clientData } from "@data/supabase";
import { MdOutlineCancel, MdOutlineEdit } from "react-icons/md";

interface IProps {
  workshop: Workshop;
  user: User | null;
}

export default function WorkshopListingDescription({ workshop, user }: IProps) {
  const [description, setDescription] = useState(workshop.description);
  const [editModeOn, setEditModeOn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const isUserHost = user?.id == workshop.user_id;
  const descriptionLength = description?.length || 0;
  const minLength = 200;
  const isValid = descriptionLength >= minLength;

  async function onSave() {
    if (!isValid) return;

    setIsSaving(true);
    try {
      workshop.description = description;
      await clientData.updateWorkshop(workshop);
      setEditModeOn(false);
      toast({
        title: "Description updated",
        description: "Your workshop description has been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update description",
        description: "Please try again later.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  }

  const onEdit = () => setEditModeOn(true);
  const onCancel = () => {
    setDescription(workshop.description);
    setEditModeOn(false);
  };

  return (
    <Box bg="white" borderBottomWidth="1px" borderBottomColor="gray.200">
      <Container maxW="7xl" px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}>
        {editModeOn ? (
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading as="h2" size="lg" color="gray.700">
                Description
              </Heading>
            </Flex>
            <FormControl isInvalid={!isValid}>
              <Textarea
                value={description}
                minH="250px"
                size="md"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what learners will gain from your workshop. Include topics covered, skill level required, and what makes your workshop unique..."
                mb={3}
              />
              <Flex justify="space-between" align="center" mb={4}>
                {!isValid ? (
                  <FormErrorMessage mb={0}>
                    At least {minLength} characters required ({minLength - descriptionLength} more needed)
                  </FormErrorMessage>
                ) : (
                  <FormHelperText mb={0} color="gray.500">
                    Provide as much detail as possible to help learners understand what they'll learn
                  </FormHelperText>
                )}
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    descriptionLength < minLength
                      ? "red.500"
                      : descriptionLength < minLength + 50
                      ? "orange.500"
                      : "gray.500"
                  }
                >
                  {descriptionLength} / {minLength} characters
                </Text>
              </Flex>
            </FormControl>
            <Flex justify="flex-end" gap={3}>
              <Button
                colorScheme="gray"
                variant="outline"
                onClick={onCancel}
                size="md"
                isDisabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                variant="solid"
                onClick={onSave}
                size="md"
                isLoading={isSaving}
                loadingText="Saving..."
                isDisabled={!isValid}
              >
                Save
              </Button>
            </Flex>
          </Box>
        ) : (
          <Box position="relative">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading as="h2" size="lg" color="gray.700">
                Description
              </Heading>
              {isUserHost && (
                <Tooltip label="Edit description" placement="top">
                  <IconButton
                    aria-label="Edit description"
                    icon={<MdOutlineEdit />}
                    variant="ghost"
                    size="md"
                    color="gray.600"
                    _hover={{ bg: "gray.100", color: "blue.600" }}
                    onClick={onEdit}
                  />
                </Tooltip>
              )}
            </Flex>
            <Text
              whiteSpace="pre-wrap"
              color="gray.600"
              fontSize="md"
              lineHeight="tall"
              w="100%"
            >
              {workshop.description}
            </Text>
          </Box>
        )}
      </Container>
    </Box>
  );
}
