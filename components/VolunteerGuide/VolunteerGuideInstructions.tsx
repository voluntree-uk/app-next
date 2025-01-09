import { Box, Text, Flex, Heading } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import Image from 'next/image'
import signUpForm from './../../public/1-signup-form.jpg'
import createWorkshop from './../../public/2-create-workshop.jpg'
import createSession from './../../public/3-create-session.jpg'

export default function VolunteerGuideInstructions(){
      const makeCard = (
        text: string,
        imgSrc: any,
        altText: string,
        number: string
      ) : ReactElement => {
        return (
        <Box 
          w={{base:"80%", sm:"70%", md:"55%", lg:"32%"}} 
          mx={{base:"auto", lg:"0"}}
          my="4">
            <Flex flexDirection={"row"} alignItems={"center"}>
              <Text as="h1" 
                p="2" 
                fontSize={{base:"5xl", sm:"6xl", md:"8xl"}} 
                color="rgba(0, 0, 0, 0.2)"
                >
                  {number}
              </Text>
              <Text p="2" fontSize={{base:"lg", sm:"xl", md:"2xl"}} fontStyle="italic">
                {text}
              </Text>
            </Flex>
            <Box borderColor={"gray.50"} boxShadow={"xl"}>
                <Image src={imgSrc} alt={altText} />
            </Box>
        </Box>
        );
      }

    const signUpText = `Create account`;

    const createWorkshopText = `Create workshop`;

    const scheduleSessionText = `Schedule sessions`;


    return (
      <Box mt="16">
        <Heading as="h3" textAlign={"center"}>It's easy to join!</Heading>
        <Flex direction={"row"} wrap={"wrap"} justifyContent={"space-between"} alignContent={"stretch"} >
            {makeCard(signUpText, signUpForm, "sign up", "01")}
            {makeCard(createWorkshopText, createWorkshop, "create workshop", "02")}
            {makeCard(scheduleSessionText, createSession, "create session", "03")}
        </Flex>
      </Box>
    )
}