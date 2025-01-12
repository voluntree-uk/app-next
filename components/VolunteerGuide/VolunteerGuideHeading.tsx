import { Box, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactElement } from "react";

export default function VolunteerGuideHeading() {

    const joinLink: ReactElement = (
      <Link as={NextLink} href={`/login`} color={"blue.600"}>
        Join Voluntree today
      </Link>
  );

    return (
      <Box mt="8" px="2">
        <Text textAlign="justify" fontSize={{ base: "md", md: "lg", lg: "xl" }}>
          Voluntree is a platform for social change designed to enable
          person-to-person knowledge and skill sharing. Unlike other platforms,
          you choose when and how to share your skills. As a not-for-profit,
          we're committed to keeping everything totally transparent and fully
          free, for everyone, forever. Create an account to connect with a
          community of changemakers, inspire others and elevate your potential -
          all on your own terms, at your own pace, and completely within your
          control. { joinLink } - let's help each other grow.
        </Text>
      </Box>
    );
}