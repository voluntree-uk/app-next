"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import config from "@config";
import { Workshop } from "@schemas";
import { clientData } from "@data/supabase";
import { User } from "@supabase/supabase-js";
import Loader from "@components/Loader";


export default function WorkshopForm({ user }: {user: User}) {
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const [name, setName] = useState<string|null>(null);
  const [category, setCategory] = useState<string|null>(null);
  const [description, setDescription] = useState<string|null>(null);

  const router = useRouter();

  function validateForm(): boolean {
    var isValid = true
    if (!name) {
      setName("");
      isValid = false;
    }
    if (!description) {
      setDescription("")
      isValid = false
    }
    if (description && description.length < 200) {
      isValid = false;
    }
    if (!category) {
      setCategory("");
      isValid = false;
    }
    return isValid
  }

  /**
   * Handles submitting the new workshop to the api
   *
   * @param formData - form field data
   */
  async function onSubmit() {
    if (validateForm()) {
      setLoading(true);
      const createdBy = user?.id;

      if (createdBy) {
        const newWorkshop: Workshop = {
          name: name!,
          user_id: createdBy,
          description: description!,
          category: category!,
          virtual: true,
        };

        try {
          const createdWorkshop = await clientData.createWorkshop(newWorkshop);
          if (createdWorkshop.id) {
            router.push(`/workshops/${createdWorkshop.id}`);
          } else {
            toast({
              title: "Failed to create workshop",
              description: "Please try again",
              status: "error",
              duration: 4000,
              isClosable: true,
            });
            setLoading(false);
          }
        } catch (error) {
          toast({
            title: "Failed to create workshop",
            description: "Please finish setting up your profile",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          router.push("/me");
          setLoading(false);
        }
      }
    }
  }


  return (
    <Container maxW="container.sm">
      {loading ? (
        <Loader message="Creating an online workshop meeting room" fullScreen />
      ) : (
        <Box p="1em">
          <Stack spacing={6}>
            <Heading size={"lg"}>Create Workshop</Heading>

            {/* Name */}
            <FormControl isInvalid={name === ""}>
              <FormLabel htmlFor="name" fontSize="md">
                Name
              </FormLabel>
              <Input
                onChange={(e) => setName(e.target.value)}
                isRequired={true}
                autoFocus={true}
              />
              {name === "" ? (
                <FormErrorMessage>Name is required</FormErrorMessage>
              ) : (
                <FormHelperText>Choose a name for your workshop</FormHelperText>
              )}
            </FormControl>

            {/* Category */}
            <FormControl isInvalid={category === ""}>
              <FormLabel htmlFor="category" fontSize="md">
                Category
              </FormLabel>
              <Select
                placeholder={"Please Select"}
                required={true}
                onChange={(e) => setCategory(e.target.value)}
              >
                {config.categories.map((category) => {
                  return (
                    <option key={category} value={category}>
                      {capitalize(category)}
                    </option>
                  );
                })}
              </Select>
              {category === "" ? (
                <FormErrorMessage>
                  Category is required, please select one
                </FormErrorMessage>
              ) : (
                <FormHelperText>Please select a category</FormHelperText>
              )}
            </FormControl>

            {/* Description */}
            <FormControl
              isInvalid={description != null && description.length < 200}
            >
              <FormLabel htmlFor="description" fontSize="md">
                Description
              </FormLabel>
              <Textarea
                minH={"18em"}
                isRequired={true}
                onChange={(e) => setDescription(e.target.value)}
              />
              {description && description?.length < 200 ? (
                <FormErrorMessage>
                  At least 200 characters required,{" "}
                  {`${200 - description.length}`} characters remaining
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  Provide as much detail as possible
                </FormHelperText>
              )}
            </FormControl>

            {/* Submit */}
            <Button
              colorScheme={"green"}
              type="submit"
              boxShadow="lg"
              onClick={() => onSubmit()}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      )}
    </Container>
  );
}
