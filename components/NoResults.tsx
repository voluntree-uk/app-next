import { AbsoluteCenter, Box, Divider } from "@chakra-ui/react";

export default function NoResults({
  message
}: {
  message: string;
}) {
  return (
    <Box textColor="gray.600" position="relative" py={"1.5em"}>
      <Divider />
      <AbsoluteCenter bg="white" textAlign={"center"}>
        {message}
      </AbsoluteCenter>
    </Box>
  );
}