import { Button, ButtonGroup, Stack, HStack, Text, Divider, VisuallyHidden } from "@chakra-ui/react";
import { GitHubIcon, GoogleIcon, TwitterIcon } from "@components/ProviderIcons";

const providers = [
  { name: "Google", icon: <GoogleIcon boxSize="5" /> },
  { name: "Twitter", icon: <TwitterIcon boxSize="5" /> },
  { name: "GitHub", icon: <GitHubIcon boxSize="5" /> },
];

export const OAuthButtonGroup = () => (
  <Stack>
    <HStack>
      <Divider />
      <Text fontSize="sm" whiteSpace="nowrap" color="muted">
        or continue with
      </Text>
      <Divider />
    </HStack>
    <ButtonGroup variant="outline" spacing="4" width="full">
      {providers.map(({ name, icon }) => (
        <Button key={name} width="full">
          <VisuallyHidden>Sign in with {name}</VisuallyHidden>
          {icon}
        </Button>
      ))}
    </ButtonGroup>
  </Stack>
);
