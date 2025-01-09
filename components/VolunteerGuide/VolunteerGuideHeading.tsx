import { Box, Text} from "@chakra-ui/react";

export default function VolunteerGuideHeading(){
    return (
      <Box mt="8" px="2">
        <Text textAlign="justify" fontSize={{base:"lg", md:"xl", lg:"2xl"}} >
          Join Voluntree and become part of a vibrant movement where your passions meet purpose. 
          Share your skills, connect with a community of changemakers, and inspire others while creating a meaningful impact—on your terms, at your pace.
        </Text>
      </Box>
    )
}