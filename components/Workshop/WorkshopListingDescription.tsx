"use client";

import React, {useState} from "react";
import { Box, 
         Flex,
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
      <Box display="flex" justifyContent="space-between" px={{base:"6", md:"16"}} p="6"
           borderBottomWidth="1px" borderBottomColor="gray.200" rounded="md">
        <FormControl
          isInvalid={description == null || description.length < 200}>
          <Heading as="h2" size="md" pb="0.5em">
            Description
          </Heading>
          <Flex direction={{ base: "column", sm: "row" }} justifyContent="space-between">
            <Box w="100%" me="4" pt="2">
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
              <FormHelperText pb={{base:"2", sm:"0"}}>
                Provide as much detail as possible
              </FormHelperText>
              )}
            </Box>
            <Flex direction={{base:"row", sm:"column"}} gap={{ base: "2", md: "4" }}>
              <Button
                colorScheme="green"
                rounded="full"
                variant="solid"
                type="submit"
                onClick={() => onSave()}
                rightIcon={<MdOutlineSave />}
                size={{ base: "sm", sm: "md" }}
                w={{ base: "100%", sm: "auto" }}
                mx="2"
              >
                Save
              </Button>
              <Button
                rounded="full"
                colorScheme="blackAlpha"
                variant="outline"
                onClick={onCancel}
                rightIcon={<MdOutlineCancel />}
                size={{ base: "sm", sm: "md" }}
                w={{ base: "100%", sm: "auto" }}
                mx="2"
                >
                  Cancel
              </Button>
            </Flex>
          </Flex>
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
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Heading as="h2" size="md" pb="0.5em">
            Description
        </Heading>
        {isUserHost && 
          <Button
            rounded="full"
            colorScheme="blackAlpha"
            variant="outline"
            rightIcon={<MdOutlineEdit />}
            onClick={() => onEdit()}
            size={{ base: "sm", sm: "md" }}
            mr="3"
            >
            Edit
          </Button>
        }
      </Flex>
     
      <Box display="flex" justifyContent="space-between" pt="2">
        <Text whiteSpace={"pre-wrap"} color={"gray.600"} fontSize={"14px"} lineHeight="6" w="100%">
          {workshop.description}
        </Text>
       
      </Box>
    </Box> )}
  </>
  );
}
