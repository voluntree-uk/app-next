import * as React from "react";
import {
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import AuthenticationLogin from "@components/Auth/AuthenticationLogin";
import AuthenticationSignUp from "@components/Auth/AuthenticationSignUp";

interface IProps {
  onSuccess(): void;
}

enum Mode {
  LOGIN,
  SIGNUP,
}

export default function AuthenticationForm({ onSuccess }: IProps) {
  const [mode, setMode] = React.useState<Mode>(Mode.LOGIN);

  return (
    <Container
      maxW="lg"
      py={{ base: "12", sm: "10" }}
      px={{ base: "0", sm: "8" }}
    >
      <Tabs variant="enclosed-colored" colorScheme="green" isFitted>
        <TabList>
          <Tab>Login</Tab>
          <Tab>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AuthenticationLogin onSuccess={onSuccess} />
          </TabPanel>
          <TabPanel>
            <AuthenticationSignUp onSuccess={onSuccess} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
