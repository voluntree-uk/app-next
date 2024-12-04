"use client";

import React, {useState} from "react";
import { Box, 
         Heading, 
         Text, 
         FormControl, 
         FormLabel, 
         FormErrorMessage,
         FormHelperText,
         Button,
         Textarea } from "@chakra-ui/react";
import { Workshop, User } from "@schemas";
import { clientData } from "@data/supabase";
import { MdOutlineCancel, MdOutlineEdit, MdOutlineSave } from "react-icons/md";

interface IProps {
  workshop: Workshop;
  user: User | null;
}

export default function WorkshopListingDescription({ workshop, user }: IProps) {
  
  const [description, setDescription] = useState(workshop.description);
  const [editModeOn, setEditModeOn] = useState(false);

  const isUserHost = user?.id == workshop.user_id;
  
  async function onSave (){
    workshop.description = description;
    await clientData.updateWorkshop(workshop);
    setEditModeOn(false);
  }

  const onEdit = () => setEditModeOn(true);
  const onCancel = () => setEditModeOn(false);

  
  return (
    <>
    {editModeOn ? (
      <Box display="flex" justifyContent="space-between" p="16">
        <FormControl
          isInvalid={description == null || description.length < 200}>
          <FormLabel htmlFor="description" fontSize="md">
            Description
          </FormLabel>
          <Box display="flex" justifyContent="space-between">
            <Box w="100%">
              <Textarea
                value = {description}
                minH={"18em"}
                isRequired={true}
                onChange={(e) => setDescription(e.target.value)}
              />
              {description == null || description.length < 200 ? (
              <FormErrorMessage>
                At least 200 characters required,{" "}
                {`${200 - description.length}`} characters remaining
              </FormErrorMessage>
              ) : (
              <FormHelperText>
                Provide as much detail as possible
              </FormHelperText>
              )}
            </Box>
            <Box w="auto" display="flex" flexDir="column">
              <Button
                colorScheme="green"
                rounded="full"
                variant="solid"
                type="submit"
                onClick={() => onSave()}
                rightIcon={<MdOutlineSave />}
                size={{ base: "xs", sm: "md" }}
                mx="3" mb="3"
              >
                Save
              </Button>
              <Button
                rounded="full"
                colorScheme="blackAlpha"
                variant="outline"
                onClick={onCancel}
                rightIcon={<MdOutlineCancel />}
                size={{ base: "xs", sm: "md" }}
                mx="3"
                >
                  Cancel
              </Button>
            </Box>
          </Box>
        </FormControl>
      </Box>
    ) : (
    <Box
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      p="6"
      rounded="md"
      px={{ base: "6", md: "16" }}
      >
      <Heading as="h2" size="md" pb="0.5em">
          Description
      </Heading>
      <Box display="flex" justifyContent="space-between">
        <Text whiteSpace={"pre-wrap"} color={"gray.600"} fontSize={"14px"} lineHeight="6" w="100%">
          {workshop.description}
        </Text>
        {isUserHost && 
        <Button
          rounded="full"
          colorScheme="blackAlpha"
          variant="outline"
          rightIcon={<MdOutlineEdit />}
          onClick={() => onEdit()}
          size={{ base: "xs", sm: "md" }}
          mr="3"
          >
          Edit
        </Button>
        }
      </Box>
    </Box> )}
  </>
  );
}
