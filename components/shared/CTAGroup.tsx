import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";

interface CTAItem {
  id: string;
  title: string;
  description: string;
  href: string;
  ctaText?: string;
}

interface CTAGroupProps {
  title?: string;
  description?: string;
  items: CTAItem[];
}

export default function CTAGroup({
  title,
  description,
  items,
}: CTAGroupProps) {
  if (!items.length) {
    return null;
  }

  return (
    <Stack spacing={{ base: 5, md: 6 }}>
      {(title || description) && (
        <Box maxW="2xl">
          {title && (
            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              mb={2}
            >
              {title}
            </Heading>
          )}
          {description && (
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
              {description}
            </Text>
          )}
        </Box>
      )}

      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 4, md: 6 }}
      >
        {items.map((item) => (
          <Card
            key={item.id}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            shadow="sm"
            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.15s ease"
            bg="white"
          >
            <CardBody>
              <Stack spacing={3}>
                <Heading fontSize={{ base: "lg", md: "xl" }}>
                  {item.title}
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  {item.description}
                </Text>
                <Box>
                  <Button
                    as={NextLink}
                    href={item.href}
                    colorScheme="blue"
                    size="sm"
                  >
                    {item.ctaText || "Get involved"}
                  </Button>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}


