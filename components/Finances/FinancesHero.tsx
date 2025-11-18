import NextLink from "next/link";
import {
    Heading,
    Stack,
    Text,
    HStack,
    Button,
    Box,
    Divider,
    Grid
} from "@chakra-ui/react";

export default function FinancesHero({ donationLink }: { donationLink: string }) {
    return (
      <Grid
        templateColumns={{ base: "1fr", md: "2fr 1fr" }}
        gap={{ base: 6, md: 10 }}
        alignItems="center"
      >
        <Stack spacing={4}>
          <Heading size="xl">Finances</Heading>
          <Text fontSize="lg" color="gray.700">
            At Voluntree, our organization operates entirely on the dedication
            of volunteers. Central to our ethos is{" "}
            <strong>absolute transparency</strong>. We believe that it's crucial
            for our donors to know exactly how their money is being spent.
            That's why we provide full access to every transaction ever made. We
            update this page monthly to make sure that you're always informed
            about the impact of your generosity.
          </Text>
          <HStack spacing={4} flexWrap="wrap">
            <Button
              as={NextLink}
              href={donationLink}
              colorScheme="blue"
              size="lg"
              w={{ base: "full", sm: "auto" }}
            >
              Donate to Voluntree
            </Button>
            <Button
              as={NextLink}
              href="/finances/transactions"
              variant="outline"
              size="lg"
              w={{ base: "full", sm: "auto" }}
            >
              View all transactions
            </Button>
          </HStack>
        </Stack>
        <Box
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
          p={5}
          bg="blue.50"
        >
          <Heading size="md" mb={3}>
            How your donations help
          </Heading>
          <Stack spacing={2} color="gray.700">
            <Text>• Keeping the platform running and secure</Text>
            <Text>• Event logistics and volunteer coordination</Text>
            <Text>
              • Covering administrative costs such as tax and accounting
              payments
            </Text>
          </Stack>
        </Box>
      </Grid>
    );
}
