"use client"
import { Box, Text, Button, Flex} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
export default function VolunteerGuideInvite(){
  const router = useRouter();
    return (
      <Box
        mt="16"
        p="1em"
        backgroundColor={"#335593"}
        textColor="white"
        borderRadius="5"
        ps={{ base: "6", md: "10", lg: "20" }}
      >
        <Text
          fontWeight={"bold"}
          textAlign={"start"}
          mt="10"
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
          fontStyle="italic"
        >
          Be the Spark That Changes Someone's Life!
        </Text>
        <Text textAlign="justify" pt="4" pe={{ base: "0", md: "10", lg: "20" }}>
          Every skill, no matter how big or small, has the power to inspire and
          transform lives. At Voluntree, we believe that when you share your
          knowledge, everybody wins. Join like-minded volunteers who are already
          making a difference and see how your passion can create lasting
          connections and help you and your community to grow.
        </Text>
        <Button
          my="8"
          backgroundColor={"white"}
          textColor="black"
          onClick={() => router.push("/login")}
        >
          Join the Movement
        </Button>
      </Box>
    );
}