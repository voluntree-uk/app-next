"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { api } from "@infra/aws";

type NewsletterSource = "landing" | "about";

interface NewsletterSubscribeProps {
  source: NewsletterSource;
}

interface NewsletterFormData {
  email: string;
}

export default function NewsletterSubscribe({
  source,
}: NewsletterSubscribeProps) {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>();

  const onSubmit = async (data: NewsletterFormData) => {
    try {
        await api.subscribeNewsletter(data.email.trim().toLowerCase(), source);
        toast({
            title: "Subscribed!",
            description: "Thank you for subscribing to our newsletter.",
            status: "success",
            duration: 4000,
            isClosable: true,
        });
        reset();
    } catch (error) {
      toast({
        title: "Could not subscribe!",
        description: "Please try again later.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box 
      bgGradient="linear(to-r, blue.700, blue.500)"
      color="white" 
      borderRadius="lg"
      p={{ base: 6, md: 10 }}
      textAlign={{ base: "left", md: "left" }}
      w="100%">
      <form onSubmit={handleSubmit(onSubmit)} noValidate >
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={3}
          align={{ base: "stretch", md: "flex-start" }}
        >
          <FormControl isInvalid={!!errors.email} flex={1}>
            <FormLabel htmlFor={`newsletter-email-${source}`} fontSize="lg">
              Subscribe to our newsletter
            </FormLabel>
            <Input
              id={`newsletter-email-${source}`}
              type="email"
              placeholder="Enter your email address"
              color="whiteAlpha.900"
              borderColor="whiteAlpha.700"
              _placeholder={{ color: "whiteAlpha.600" }}
              _focus={{borderColor: "whiteAlpha.900"}}
              autoComplete="email"
              {...register("email", {
                required: "Email address is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address"
                },
              })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            colorScheme="whiteAlpha"
            bg="white"
            color="blue.700"
            isLoading={isSubmitting}
            loadingText="Subscribing..."
            isDisabled={isSubmitting}
            alignSelf={{ base: "stretch", md: "flex-start" }}
            mt={{ base: 0, md: 8 }}
            _hover={{ bg: "whiteAlpha.900" }}
          >
            Subscribe
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
