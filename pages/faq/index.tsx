import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  HStack,
  VStack,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import Layout from "../../components/Layout";
import HeadingBar from "../../components/HeadingBar";

// Replace test data with your own
const features = Array.apply(null, Array(8)).map(function (x, i) {
  return {
    id: i,
    title: "Lorem ipsum dolor sit amet",
    text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.",
  };
});

export default function GridListWithHeading() {
  return (
    <Layout>
      <HeadingBar>
        <Heading
          fontSize={"md"}
          color={"white"}
          fontWeight="semibold"
          pl={8}
          pb={4}
        >
          FAQ
        </Heading>
      </HeadingBar>
      <Box m={3} bg="white">
        <Accordion borderColor={"gray.200"} borderWidth={0.5}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  How do I join a workshop?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Layout>
  );
}
