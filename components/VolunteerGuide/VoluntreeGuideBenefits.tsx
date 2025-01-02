import { Box, Card, Text, Flex, Img, Heading } from "@chakra-ui/react";
import React, { ReactElement } from "react";

export default function VolunteerGuideBenefits(){

    const makeCard = (
        heading: string,
        text:string
      ) : ReactElement => {
        return (
          <Card boxShadow={"md"} mx={{base:"auto", lg:"0"}} my="3" p="3" w={{base:"60%", lg:"22%"}}  backgroundColor={"#78DDCF"} textColor="white">
            <Text fontSize={{base:"md", md:"lg"}} fontWeight={"bold"}>{heading}</Text>
            <Text fontSize={{base:"sm", md:"md"}} p="3" mt="3" backgroundColor={"white"} textColor={"black"} borderRadius={"5"} fontStyle={"italic"} h="100%">
                {text}
            </Text>
          </Card>
        );
      }

    const noExperienceRequiredText = `You don't need professional experience to teach a workshop.`;

    const flexibilityText = `Teach workshops when and how it suits you.`;

    const communityText = `Help others grow while building a stronger, connected community.`;

    const skillDevelopmentText = `Sharpen your teaching, communication, and leadership skills`;


    return (
      <Box mt="8">
        <Flex direction={"row"} wrap="wrap" justifyContent={"space-between"} alignContent={"stretch"} >
            {makeCard( "No experience required",noExperienceRequiredText)}
            {makeCard("Flexibility", flexibilityText)}
            {makeCard("Community Impact", communityText)}
            {makeCard("Skill development", skillDevelopmentText)}

        </Flex>
      </Box>
    )
}