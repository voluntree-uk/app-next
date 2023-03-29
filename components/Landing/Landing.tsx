import { Box, Container } from "@chakra-ui/react";
import LandingHeading from "./LandingHeading";
import LandingHowItWorks from "./LandingHowItWorks";

export default function Landing() {
  return (
    <Container p={{ base: "6", sm: "0" }} maxW={"7xl"}>
      <Box pb={{ base: "16" }}>
        <LandingHeading />
      </Box>
      <Box pb={{ base: "16", sm: "10" }}>
        <LandingHowItWorks />
      </Box>
    </Container>
  );
}
