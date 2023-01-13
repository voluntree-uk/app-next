import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  Center,
  Text,
  Flex,
  Img,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BsArrowRightCircleFill } from "react-icons/bs";

export default function Landing() {
  const router = useRouter();
  return (
    <Box px={{ base: "8", sm: "20" }}>
      <Center pt="28" pb="16">
        <Heading textAlign={"center"} fontSize="100px" fontWeight="400">
          We&apos;re a platform with purpose
        </Heading>
      </Center>

      <Center pb="36">
        <Button
          color={"white"}
          size="lg"
          onClick={() => router.push("/workshops")}
          bg="black"
          rounded={"full"}
          border={"1px solid transparent"}
          px="7"
          py="7"
          fontWeight={"light"}
          _hover={{
            bg: "transparent",
            color: "black",
            border: "1px solid black",
          }}
        >
          Browse workshops
        </Button>
      </Center>

      <Box w="75%">
        <Heading size={"4xl"} pb="8" fontWeight="400">
          Better begins today
        </Heading>

        <Text fontSize={"3xl"} fontWeight="light">
          Showing up for people and the planet, using the platform to drive
          meaningful change where it matters most.
        </Text>
      </Box>

      <Flex justifyContent={"space-around"} pt="28">
        <Box border={"1px solid black"} p="10" py="8" rounded={"2xl"} w="350px">
          <Heading pb="2" fontWeight={"semibold"} size={"4xl"}>
            145
          </Heading>
          <Text pl={"2"} fontWeight="light">
            workshops
          </Text>
        </Box>

        <Box border={"1px solid black"} p="10" py="8" rounded={"2xl"} w="350px">
          <Heading pb="2" fontWeight={"semibold"} size={"4xl"}>
            452
          </Heading>
          <Text pl={"1"} fontWeight="light">
            number of volunteers
          </Text>
        </Box>

        <Box border={"1px solid black"} p="10" py="8" rounded={"2xl"} w="350px">
          <Heading pb="2" fontWeight={"semibold"} size={"4xl"}>
            406 K
          </Heading>
          <Text pl={"1"} fontWeight="light">
            monthly users
          </Text>
        </Box>
      </Flex>

      <Center>
        <Img
          rounded={"xl"}
          src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tbXVuaXR5fGVufDB8fDB8fA%3D%3D&w=1000&q=80"
          my="32"
        />
      </Center>

      <Box>
        <Center>
          <Heading size={"4xl"} pb="8" fontWeight="400">
            Directly democratic
          </Heading>
        </Center>

        <Center>
          <Text
            textAlign={"center"}
            fontSize={"3xl"}
            fontWeight="light"
            w="75%"
          >
            Totally transparent, directly democratic, and free to use, Societree
            will enable you to help your community, build your reputation and
            learn some brand new skills.
          </Text>
        </Center>
      </Box>

      <Flex justifyContent={"space-around"} pt="28">
        <Link href={"/workshops"}>
          <Box
            border={"1px solid black"}
            p="10"
            py="8"
            rounded={"2xl"}
            w="350px"
            _hover={{ bg: "black", color: "white", cursor: "pointer" }}
          >
            <Heading pb="2" fontWeight={"semibold"} size={"2xl"}>
              Languages
            </Heading>
            <Flex alignItems={"center"}>
              <Text pr={2} fontWeight="light">
                12 available
              </Text>
              <ArrowRightIcon fontSize={"8px"} />
            </Flex>
          </Box>
        </Link>

        <Link href={"/workshops"}>
          <Box
            border={"1px solid black"}
            p="10"
            py="8"
            rounded={"2xl"}
            w="350px"
            _hover={{ bg: "black", color: "white", cursor: "pointer" }}
          >
            <Heading pb="2" fontWeight={"semibold"} size={"2xl"}>
              Finance
            </Heading>
            <Flex alignItems={"center"}>
              <Text pr={2} fontWeight="light">
                12 available
              </Text>
              <ArrowRightIcon fontSize={"8px"} />
            </Flex>
          </Box>
        </Link>

        <Link href={"/workshops"}>
          <Box
            border={"1px solid black"}
            p="10"
            py="8"
            rounded={"2xl"}
            w="350px"
            _hover={{ bg: "black", color: "white", cursor: "pointer" }}
          >
            <Heading pb="2" fontWeight={"semibold"} size={"2xl"}>
              Arts
            </Heading>
            <Flex alignItems={"center"}>
              <Text pr={2} fontWeight="light">
                12 available
              </Text>
              <ArrowRightIcon fontSize={"8px"} />
            </Flex>
          </Box>
        </Link>
      </Flex>

      <Box w="65%" my="32">
        <Heading size={"3xl"} pb="8" fontWeight="400">
          Social exchange
        </Heading>

        <Text fontSize={"2xl"} fontWeight="light" lineHeight={"10"} pb="8">
          Built on a commitment to the idea that social exchange has real
          material value, Societree is a social experiment platform that
          challenges the conventional capitalist business structures.
        </Text>

        <Flex fontSize={"xl"} alignItems={"center"}>
          <Text fontWeight="semibold" pr={3}>
            <Link href={"/workshops"}>Check out workshops</Link>
          </Text>
          <BsArrowRightCircleFill />
        </Flex>
      </Box>
    </Box>
  );
}
