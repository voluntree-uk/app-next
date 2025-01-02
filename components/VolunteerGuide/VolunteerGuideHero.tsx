import { Box, Heading, Text, Img } from "@chakra-ui/react";

export default function VolunteerGuideHero() {
  return (
    <Box position="relative">
      <Img
        src="hero-img.jpg"
        alt="Hero image"
      />

      <Box
        position="absolute"
        top={{base:"10%", sm:"15%", md:"20%"}}
        left={{base:"0", lg:"20px"}}
        color="black"
        px={{base:"2", md:"4"}}
      >
        <Heading as="h1" fontSize={{ base: "2xl", sm: "4xl", md: "5xl", lg: "7xl", xl:"8xl" }} fontWeight="bold">
            Share Your Skills
        </Heading>
        
      </Box>
      <Text 
          fontSize={{ base: "md", md: "lg" }} 
          mt="4" 
          p="4" 
          color="white" 
          backgroundColor={"#FFB144"} 
          fontWeight="bold" 
          borderRadius="5" 
          textAlign={"center"}>
              Inspire Others and Make a Difference!
      </Text>
    </Box>
  );
}
