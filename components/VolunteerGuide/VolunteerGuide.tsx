import { Box } from "@chakra-ui/react";
import VolunteerGuideHero from "./VolunteerGuideHero";
import VolunteerGuideHeading from "./VolunteerGuideHeading";
import VolunteerGuideBenefits from "./VoluntreeGuideBenefits";
import VolunteerGuideInstructions from "./VolunteerGuideInstructions";
import VolunteerGuideInvite from "./VolunteerGuideInvite";

export default function VolunteerGuide(){
    return (
      <Box w="100%" px={{base:"3", md:"10", lg:"3", xl:"0"}}>
        <VolunteerGuideHero />
        <VolunteerGuideHeading />
        <VolunteerGuideBenefits />
        <VolunteerGuideInstructions />
        <VolunteerGuideInvite />
      </Box>
    )
}
