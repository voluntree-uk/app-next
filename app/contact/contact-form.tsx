"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";

interface ContactFormData {
  name: string;
  email: string;
  purpose: string;
  message: string;
}

interface IProps {
  submitContact(
    name: string,
    email: string,
    purpose: string,
    message: string
  ): Promise<{ success: boolean; error: string | undefined }>;
}

export default function ContactForm({ submitContact }: IProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ContactFormData>({
    defaultValues: {
      purpose: "Get Involved",
    },
  });

  const showToast = (
    title: string,
    description: string | null = null,
    success: boolean = true
  ) => {
    toast({
      title: title,
      description: description,
      status: success ? "success" : "error",
      duration: 4000,
      isClosable: true,
    });
  };

  const onSubmit = async (formData: ContactFormData) => {
    setIsLoading(true);
    const { success, error } = await submitContact(
      formData.name,
      formData.email,
      formData.purpose,
      formData.message
    );

    if (success) {
      showToast("Message sent successfully!", "We'll get back to you soon.");
      // Reset form
      reset({
        name: "",
        email: "",
        purpose: "Get Involved",
        message: "",
      });
    } else {
      showToast("Failed to send message", error || "Please try again later.", false);
    }
    setIsLoading(false);
  };

  return (
    <Container maxW="2xl" py={{ base: "12", md: "16" }} px={{ base: "4", sm: "8" }}>
      <VStack align="stretch" spacing={8}>
        {/* Header */}
        <Box>
          <Heading size={{ base: "xl", md: "2xl" }} fontWeight="bold" mb={3} color="gray.700">
            Contact Us
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Have a question or want to get in touch? Fill out the form below and we'll get back to you as soon as possible.
          </Text>
        </Box>

        {/* Form */}
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="xl"
          p={{ base: 6, md: 8 }}
          boxShadow="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={6}>
              {/* Name */}
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name" fontSize="md" fontWeight="semibold" color="gray.700">
                  Name
                </FormLabel>
                <Input
                  id="name"
                  placeholder="Your name"
                  size="md"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>

              {/* Email */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email" fontSize="md" fontWeight="semibold" color="gray.700">
                  Email
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  size="md"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>

              {/* Purpose */}
              <FormControl isInvalid={!!errors.purpose}>
                <FormLabel htmlFor="purpose" fontSize="md" fontWeight="semibold" color="gray.700">
                  Purpose
                </FormLabel>
                <Controller
                  name="purpose"
                  control={control}
                  rules={{ required: "Please select a purpose" }}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                        <Radio value="Get Involved" colorScheme="green">
                          Get Involved
                        </Radio>
                        <Radio value="Report a Bug" colorScheme="red">
                          Report a Bug
                        </Radio>
                        <Radio value="Get in Touch" colorScheme="blue">
                          Get in Touch
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
                {errors.purpose && (
                  <FormErrorMessage>{errors.purpose.message}</FormErrorMessage>
                )}
              </FormControl>

              {/* Message */}
              <FormControl isInvalid={!!errors.message}>
                <FormLabel htmlFor="message" fontSize="md" fontWeight="semibold" color="gray.700">
                  Message
                </FormLabel>
                <Textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  size="md"
                  rows={6}
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                  })}
                />
                {errors.message && (
                  <FormErrorMessage>{errors.message.message}</FormErrorMessage>
                )}
              </FormControl>

              {/* Submit Button */}
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isLoading}
                size="lg"
                w="full"
                boxShadow="md"
              >
                Send Message
              </Button>
            </Stack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
}

