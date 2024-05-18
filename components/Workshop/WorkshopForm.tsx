import React, { useState } from "react";
import { useRouter } from "next/router";
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
import { useSession } from "@util/hooks";
import { data } from "@data/supabase";


export default function WorkshopForm() {
  const session = useSession();

  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    if (validateForm()) {
      const createdBy = session?.user?.id;

      if (createdBy) {
        const newWorkshop: Workshop = {
          name: name!,
          user_id: createdBy,
          description: description!,
          category: category!,
          virtual: true,
        };

        const createdWorkshop = await data.createWorkshop(newWorkshop);

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
        }
      }
    }

    setIsLoading(false);
  }


  return (
    <Container maxW="container.sm">
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
              <FormHelperText>
                Please select a category
              </FormHelperText>
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
            isLoading={isLoading}
            boxShadow="lg"
            onClick={() => onSubmit()}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
