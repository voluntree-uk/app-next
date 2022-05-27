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
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useSession } from "../utils/hooks";
import { supabase } from "../utils/supabaseClient";

type WorkshopFormState = {
  name: string;
  description: string;
  category: string;
  organiser: string;
  house: string;
  street: string;
  postcode: string;
  virtual: boolean;
};

/**
 * Renders a form for creating workshops
 */
export default function WorkshopForm(): JSX.Element {
  const session = useSession();

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkshopFormState>({
    defaultValues: { virtual: true },
  });

  const router = useRouter();

  const { virtual } = watch();

  async function onSubmit(formData: WorkshopFormState) {
    const { data, error } = await supabase
      .from("workshops")
      .insert([{ ...formData, organiser: session?.user?.id }]);

    if (error == null) {
      reset();
      router.push(`/workshops/${data[0].id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            placeholder="Trading for Beginners"
            bg={"white"}
            focusBorderColor="brand.700"
            boxShadow={"sm"}
            borderRadius="xl"
            size="lg"
            p={7}
            {...register("name", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            placeholder="A brief introduction into everything..."
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
              {...register("virtual", {
                required: "This is required",
              })}
            />
          </Flex>
        </FormControl>

        {!virtual ? (
          <>
            <FormControl>
              <Input
                id="houseNo"
                placeholder="21"
                bg={"white"}
                focusBorderColor="brand.700"
                boxShadow={"sm"}
                borderRadius="xl"
                size="lg"
                p={7}
                {...register("house", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.house && errors.house.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <Input
                id="streetName"
                placeholder="Square Gardens"
                bg={"white"}
                focusBorderColor="brand.700"
                boxShadow={"sm"}
                borderRadius="xl"
                size="lg"
                p={7}
                {...register("street", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.street && errors.street.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <Input
                id="postcode"
                placeholder="B14 6PZ"
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
