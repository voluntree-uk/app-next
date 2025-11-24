import {
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Text,
  Stack,
} from "@chakra-ui/react";

interface AboutValue {
  key: string;
  name: string;
  description: string;
}

interface ValueListProps {
  values: AboutValue[];
}

export default function ValueList({ values }: ValueListProps) {
  if (!values.length) {
    return null;
  }

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2 }}
      spacing={{ base: 5, md: 6 }}
    >
      {values.map((value) => (
        <Card
          key={value.key}
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.200"
          shadow="sm"
          bg="white"
          _hover={{ shadow: "lg", transform: "translateY(-4px)", borderColor: "blue.300" }}
          transition="all 0.2s ease"
        >
          <CardBody p={{ base: 5, md: 6 }}>
            <Stack spacing={3}>
              <Heading fontSize={{ base: "lg", md: "xl" }} fontWeight="semibold" color="gray.900">
                {value.name}
              </Heading>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" lineHeight="tall">
                {value.description}
              </Text>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
}


