import { Box, Heading, Img } from "@chakra-ui/react";
import React from "react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import WorkshopForm from "../../components/WorkshopForm";
import enforceAuthenticated from "../../utils/enforceAuthenticated";

export default function New() {
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
          New workshop
        </Heading>
      </HeadingBar>
      <Box bg="white" p={5}>
        <WorkshopForm />
      </Box>
      <Img src="https://img.freepik.com/free-vector/business-team-brainstorm-idea-lightbulb-from-jigsaw-working-team-collaboration-enterprise-cooperation-colleagues-mutual-assistance-concept-pinkish-coral-bluevector-isolated-illustration_335657-1651.jpg?t=st=1653901962~exp=1653902562~hmac=0eb8089d9a0fde4ec5eab99f2ecbc30462b271d6305ee86959c8efdf8fbbc60b&w=2000" />
    </Layout>
  );
}

export const getServerSideProps = enforceAuthenticated();
