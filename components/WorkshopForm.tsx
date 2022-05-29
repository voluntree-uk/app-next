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
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Slot, Workshop } from "../shared/schemas";
import { useSession } from "../utils/hooks";
import { supabase } from "../utils/supabaseClient";
import Slider from "./Slider";
import WorkshopSlotForm from "./WorkshopSlotForm";

export default function WorkshopForm(): JSX.Element {
  const session = useSession();
  const [slots, setSlots] = useState<any[]>([]);

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Workshop>({
    defaultValues: { virtual: true },
  });

  const router = useRouter();

  const { virtual } = watch();

  async function onSubmit(data: Workshop) {
    const newWorkshop: Workshop = data;

    // Current user
    const createdBy = session?.user?.id;

    if (createdBy) {
      newWorkshop.user_id = createdBy;

      const { data, error } = await supabase
        .from("workshops")
        .insert([newWorkshop]);

      if (data) {
        const newSlots: Slot[] = slots.map((s) => {
          return {
            workshop_id: data && data[0].id,
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime,
          };
        });

        const { data } = await supabase.from("slots").insert([newSlots]);
      }

      // insert slots

      if (error == null) {
        reset();
        router.push(`/workshops/${data[0].id}`);
      }
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              {...register("name", {
                required: "This is required",
              })}
              variant="filled"
              placeholder="Title"
              autoFocus={true}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              {...register("description", {
                required: "This is required",
              })}
              variant="filled"
              placeholder="About"
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
                variant="filled"
              />
            </Flex>
          </FormControl>

          {!virtual ? (
            <>
              <FormControl>
                <Input
                  {...register("house", {
                    required: "This is required",
                  })}
                  variant="filled"
                  placeholder="Building No"
                />
                <FormErrorMessage>
                  {errors.house && errors.house.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <Input
                  {...register("street", {
                    required: "This is required",
                  })}
                  variant="filled"
                  placeholder="Street"
                />
                <FormErrorMessage>
                  {errors.street && errors.street.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <Input
                  {...register("postcode", {
                    required: "This is required",
                  })}
                  variant="filled"
                  placeholder="Postcode"
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
              {...register("category", {
                required: "This is required",
              })}
              variant="filled"
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

          <Button variant="ghost" size="md" onClick={onOpen}>
            Add Slot
          </Button>

          <Button type="submit" isLoading={isSubmitting}>
            Submit
          </Button>
        </Stack>
      </form>

      <Slider title="Create slot" onClose={onClose} isOpen={isOpen}>
        <WorkshopSlotForm
          onSubmit={(data) => setSlots((old) => [...old, data])}
        />
      </Slider>
    </>
  );
}
