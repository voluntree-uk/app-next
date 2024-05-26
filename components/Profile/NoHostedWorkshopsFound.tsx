import { Box, Button, Center, VStack } from "@chakra-ui/react";
import Show from "@components/Helpers/Show";
import { useRouter } from "next/router";

interface IProps {
  isMe: boolean;
}

export default function NoHostedWorkshopsFound({ isMe }: IProps) {
  const router = useRouter();

  function directToNewWorkshop() {
    router.push(`/workshops/new`);
  }
  
  return (
    <VStack spacing="1vw">
      <Box textColor="gray.600">
        <Center>No Workshops Found</Center>
      </Box>
      <Show showIf={isMe}>
        <Box>
          <Button
            variant={"outline"}
            onClick={() => directToNewWorkshop()}
          >
            Create Workshop
          </Button>
        </Box>
      </Show>
    </VStack>
  );
}
