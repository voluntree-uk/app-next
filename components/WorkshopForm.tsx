import {
  Stack,
  Input,
  Select,
  Button,
  Textarea,
  FormControl,
  Text,
  FormErrorMessage,
  FormLabel,
  Switch,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

type WorkshopFormState = {
  title: string;
  description: string;
  category: string;
  organiser: string;
  houseNo: string;
  streetName: string;
  postcode: string;
  isVirtual: boolean;
};

/**
 * Renders a form for creating workshops
 */
export default function WorkshopForm(): JSX.Element {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WorkshopFormState>({ defaultValues: { isVirtual: true } });

  const { isVirtual } = watch();

  async function onSubmit(data: WorkshopFormState) {}

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <FormControl>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            placeholder="Name your workshop"
            bg={"white"}
            focusBorderColor="brand.700"
            boxShadow={"sm"}
            borderRadius="xl"
            size="lg"
            p={7}
            {...register("title", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            placeholder="Give it a description"
            bg={"white"}
            focusBorderColor="brand.700"
            boxShadow={"sm"}
            borderRadius="xl"
            size="lg"
            p={7}
            minH={40}
            {...register("description", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          display="flex"
          alignItems="center"
          justifyContent={"space-between"}
        >
          <FormLabel htmlFor="isVirtual" mb="0">
            Location
          </FormLabel>
          <Flex alignItems={"center"}>
            <Text mr={2}>Virtual?</Text>
            <Switch
              id="isVirtual"
              colorScheme={"twitter"}
              {...register("isVirtual", {
                required: "This is required",
              })}
            />
          </Flex>
        </FormControl>

        {!isVirtual ? (
          <>
            <FormControl>
              <Input
                id="houseNo"
                placeholder="House No"
                bg={"white"}
                focusBorderColor="brand.700"
                boxShadow={"sm"}
                borderRadius="xl"
                size="lg"
                p={7}
                {...register("houseNo", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.houseNo && errors.houseNo.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <Input
                id="streetName"
                placeholder="Steet Name"
                bg={"white"}
                focusBorderColor="brand.700"
                boxShadow={"sm"}
                borderRadius="xl"
                size="lg"
                p={7}
                {...register("streetName", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.streetName && errors.streetName.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <Input
                id="postcode"
                placeholder="Postcode"
                bg={"white"}
                focusBorderColor="brand.700"
                boxShadow={"sm"}
                borderRadius="xl"
                size="lg"
                p={7}
                {...register("postcode", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.postcode && errors.postcode.message}
              </FormErrorMessage>
            </FormControl>
          </>
        ) : null}

        <FormControl>
          <FormLabel htmlFor="category">Category</FormLabel>
          <Select
            id="category"
            placeholder="Pick a category"
            bg={"white"}
            focusBorderColor="brand.700"
            boxShadow={"sm"}
            borderRadius="xl"
            size="lg"
            {...register("category", {
              required: "This is required",
            })}
          >
            <option value="it">IT</option>
            <option value="legal">Legal</option>
            <option value="finance">Finance</option>
            <option value="languages">Languages</option>
            <option value="arts">Arts</option>
            <option value="other">Other</option>
          </Select>
          <FormErrorMessage>
            {errors.category && errors.category.message}
          </FormErrorMessage>
        </FormControl>

        <Button variant="ghost" size="md">
          Add Slot
        </Button>

        <Button
          bg="brand.700"
          color="white"
          size="md"
          py={7}
          borderRadius="2xl"
          type="submit"
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}
