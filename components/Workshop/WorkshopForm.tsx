"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Stack,
  Input,
  Select,
  Button,
  Textarea,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Box,
  Heading,
  Container,
  useToast,
  FormHelperText,
  Text,
  VStack,
  HStack,
  Radio,
  RadioGroup,
  Flex,
  Alert,
  AlertDescription,
  AlertIcon,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { BiMap, BiVideo } from "react-icons/bi";
import config from "@config";
import { Workshop } from "@schemas";
import { clientData } from "@data/supabase";
import { User } from "@supabase/supabase-js";
import Loader from "@components/Loader";

interface WorkshopFormData {
  name: string;
  category: string;
  description: string;
  virtual: boolean;
  city?: string;
  postcode?: string;
  meeting_place?: string;
}

export default function WorkshopForm({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<WorkshopFormData>({
    defaultValues: {
      virtual: true,
    },
  });

  const isVirtual = watch("virtual");
  const description = watch("description");
  const descriptionLength = description?.length || 0;
  const minDescriptionLength = 200;

  const onSubmit = async (data: WorkshopFormData) => {
    setLoading(true);
    const createdBy = user?.id;

    if (createdBy) {
      const newWorkshop: Workshop = {
        name: data.name,
        user_id: createdBy,
        description: data.description,
        category: data.category,
        virtual: data.virtual,
        city: data.virtual ? undefined : data.city,
        postcode: data.virtual ? undefined : data.postcode?.toUpperCase().trim(),
        meeting_place: data.virtual ? undefined : data.meeting_place,
      };

      try {
        const createdWorkshop = await clientData.createWorkshop(newWorkshop);
        if (createdWorkshop.id) {
          toast({
            title: "Meetup created successfully!",
            description: "Now add sessions to make your meetup live",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          router.push(`/workshops/${createdWorkshop.id}`);
        } else {
          toast({
            title: "Failed to create meetup",
            description: "Please try again",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          setLoading(false);
        }
      } catch (error) {
        toast({
          title: "Failed to create meetup",
          description: "Please try again later",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        router.push("/");
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <Loader message="Creating your meetup..." fullScreen />;
  }

  return (
    <Container maxW="3xl" px={{ base: 6, md: 10 }} py={{ base: 8, md: 12 }}>
      <VStack align="stretch" spacing={8}>
        {/* Header */}
        <Box>
          <Heading size={{ base: "xl", md: "2xl" }} fontWeight="bold" mb={3} color="gray.700">
            Create Your Meetup
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Share your skills and knowledge with the community. Fill out the details below to get started.
          </Text>
        </Box>

        {/* Form */}
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="xl"
          p={{ base: 6, md: 8 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={6}>
              {/* Workshop Name */}
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name" fontSize="md" fontWeight="semibold" color="gray.700">
                  Meetup Name
                </FormLabel>
                <Input
                  id="name"
                  placeholder="e.g., Intro to Web Development"
                  size="md"
                  {...register("name", {
                    required: "Meetup name is required",
                    minLength: {
                      value: 5,
                      message: "Name must be at least 5 characters",
                    },
                  })}
                />
                {errors.name ? (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                ) : (
                  <FormHelperText color="gray.500">
                    Choose a clear, descriptive name that tells people what they'll learn
                  </FormHelperText>
                )}
              </FormControl>

              {/* Category */}
              <FormControl isInvalid={!!errors.category}>
                <FormLabel htmlFor="category" fontSize="md" fontWeight="semibold" color="gray.700">
                  Category
                </FormLabel>
                <Select
                  id="category"
                  placeholder="Select a category"
                  size="md"
                  {...register("category", {
                    required: "Please select a category",
                  })}
                >
                  {config.categories.map((category) => (
                    <option key={category} value={category}>
                      {capitalize(category)}
                    </option>
                  ))}
                </Select>
                {errors.category ? (
                  <FormErrorMessage>{errors.category.message}</FormErrorMessage>
                ) : (
                  <FormHelperText color="gray.500">
                    Help learners find your meetup by selecting the right category
                  </FormHelperText>
                )}
              </FormControl>

              {/* Location Type */}
              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold" color="gray.700" mb={3}>
                  Location Type
                </FormLabel>
                <RadioGroup
                  value={isVirtual ? "virtual" : "in-person"}
                  onChange={(value) => setValue("virtual", value === "virtual")}
                >
                  <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                    <Box
                      as="label"
                      cursor="pointer"
                      borderWidth="2px"
                      borderColor={isVirtual ? "blue.500" : "gray.200"}
                      borderRadius="lg"
                      p={4}
                      bg={isVirtual ? "blue.50" : "white"}
                      _hover={{ borderColor: isVirtual ? "blue.600" : "gray.300" }}
                      transition="all 0.2s"
                    >
                      <Radio value="virtual" size="lg" colorScheme="blue" display="none" />
                      <HStack spacing={3}>
                        <Box as={BiVideo} fontSize="xl" color={isVirtual ? "blue.500" : "gray.400"} />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="semibold" color={isVirtual ? "blue.700" : "gray.700"}>
                            Online
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Host sessions virtually
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                    <Box
                      as="label"
                      cursor="pointer"
                      borderWidth="2px"
                      borderColor={!isVirtual ? "blue.500" : "gray.200"}
                      borderRadius="lg"
                      p={4}
                      bg={!isVirtual ? "blue.50" : "white"}
                      _hover={{ borderColor: !isVirtual ? "blue.600" : "gray.300" }}
                      transition="all 0.2s"
                    >
                      <Radio value="in-person" size="lg" colorScheme="blue" display="none" />
                      <HStack spacing={3}>
                        <Box as={BiMap} fontSize="xl" color={!isVirtual ? "blue.500" : "gray.400"} />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="semibold" color={!isVirtual ? "blue.700" : "gray.700"}>
                            In-Person
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Meet at a physical location
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  </Stack>
                </RadioGroup>
              </FormControl>

              {/* In-person location (only when in-person) */}
              {!isVirtual && (
                <>
                  <Alert status="info" borderRadius="md" bg="blue.50">
                    <AlertIcon />
                    <AlertDescription>
                      We encourage meeting in a public space, e.g. a park, cafe, or library, so everyone feels safe and welcome.
                    </AlertDescription>
                  </Alert>
                  <FormControl isInvalid={!!errors.meeting_place}>
                    <FormLabel htmlFor="meeting_place" fontSize="md" fontWeight="semibold" color="gray.700">
                      Name of the place
                    </FormLabel>
                    <Input
                      id="meeting_place"
                      placeholder="e.g. College Green, The Coffee House, Central Library"
                      size="md"
                      {...register("meeting_place", {
                        required: "Name of the place is required for in-person sessions",
                        minLength: {
                          value: 2,
                          message: "Please enter the name of the venue or public space",
                        },
                      })}
                    />
                    {errors.meeting_place ? (
                      <FormErrorMessage>{errors.meeting_place.message}</FormErrorMessage>
                    ) : (
                      <FormHelperText color="gray.500">
                        The cafe, park, library, or other public space where you'll meet
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.city}>
                    <FormLabel htmlFor="city" fontSize="md" fontWeight="semibold" color="gray.700">
                      City
                    </FormLabel>
                    <Input
                      id="city"
                      placeholder="e.g., Bristol, London, Manchester"
                      size="md"
                      {...register("city", {
                        required: "City is required for in-person sessions",
                      })}
                    />
                    {errors.city ? (
                      <FormErrorMessage>{errors.city.message}</FormErrorMessage>
                    ) : (
                      <FormHelperText color="gray.500">
                        The city where the session will take place
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.postcode}>
                    <FormLabel htmlFor="postcode" fontSize="md" fontWeight="semibold" color="gray.700">
                      Postcode
                    </FormLabel>
                    <Input
                      id="postcode"
                      placeholder="e.g., BS1 5TJ"
                      size="md"
                      maxLength={8}
                      {...register("postcode", {
                        required: "Postcode is required for in-person sessions",
                      })}
                    />
                    {errors.postcode ? (
                      <FormErrorMessage>{errors.postcode.message}</FormErrorMessage>
                    ) : (
                      <FormHelperText color="gray.500">
                        UK postcode
                      </FormHelperText>
                    )}
                  </FormControl>
                </>
              )}

              {/* Description */}
              <FormControl isInvalid={!!errors.description}>
                <FormLabel htmlFor="description" fontSize="md" fontWeight="semibold" color="gray.700">
                  Description
                </FormLabel>
                <FormHelperText color="gray.500" mt={0} mb={2}>
                  Write at least {minDescriptionLength} characters so attendees know what to expect
                </FormHelperText>
                <Textarea
                  id="description"
                  placeholder="Describe what attendees will gain from your meetup. Include topics covered, skill level required, and what makes your meetup unique..."
                  minH="200px"
                  size="md"
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: minDescriptionLength,
                      message: `Description must be at least ${minDescriptionLength} characters`,
                    },
                  })}
                />
                <Flex justify="space-between" align="center" mt={2} gap={3} flexWrap="wrap">
                  {errors.description && (
                    <FormErrorMessage mb={0}>
                      {errors.description.message}
                    </FormErrorMessage>
                  )}
                  <Text
                    fontSize="sm"
                    color={
                      descriptionLength < minDescriptionLength
                        ? "red.500"
                        : descriptionLength < minDescriptionLength + 50
                        ? "orange.500"
                        : "green.600"
                    }
                    fontWeight="medium"
                    whiteSpace="nowrap"
                  >
                    {descriptionLength < minDescriptionLength && (
                      <>
                        add at least{" "}
                        {minDescriptionLength - descriptionLength} more characters (minimum {minDescriptionLength})
                      </>
                    )}
                  </Text>
                </Flex>
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={loading}
                loadingText="Creating..."
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Create Meetup
              </Button>
            </Stack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
}
