"use client";

import { 
  Box, 
  Button, 
  VStack, 
  Text,
  Icon,
  Heading
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { HiOutlineAcademicCap, HiOutlineSparkles } from "react-icons/hi";

interface IProps {
  isMe: boolean;
}

export default function NoHostedWorkshopsFound({ isMe }: IProps) {
  const router = useRouter();

  function directToNewWorkshop() {
    router.push(`/workshops/new`);
  }

  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={8}
      textAlign="center"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <VStack spacing={6}>
        <Box>
          <Icon 
            as={isMe ? HiOutlineSparkles : HiOutlineAcademicCap} 
            boxSize={16} 
            color={isMe ? "blue.400" : "gray.400"} 
          />
        </Box>
        
        {isMe ? (
          <>
            <VStack spacing={3}>
              <Heading size="md" color="gray.700">
                Start Sharing
              </Heading>
              <Text fontSize="md" color="gray.600" maxW="500px">
                You haven't hosted any workshops yet.
                Create your first workshop and start sharing your passion with the community!
              </Text>
            </VStack>
            <VStack spacing={3} w="100%" maxW="300px">
              <Button
                colorScheme="blue"
                size="md"
                onClick={directToNewWorkshop}
                leftIcon={<Icon as={HiOutlineAcademicCap} />}
                w="100%"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                transition="all 0.2s"
              >
                Create First Workshop
              </Button>
              <Text fontSize="sm" color="gray.500">
                It only takes a few minutes to set up
              </Text>
            </VStack>
          </>
        ) : (
          <VStack spacing={2}>
            <Heading size="md" color="gray.700">
              No Workshops Yet
            </Heading>
            <Text fontSize="md" color="gray.600" maxW="400px">
              This user hasn't hosted any workshops yet. Check back later!
            </Text>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
