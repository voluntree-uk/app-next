import { ReactNode } from "react";
import NextLink from "next/link";
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={6}
      h={6}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer({
  openCookieConsent
}: {
  openCookieConsent: () => void;
}) {
  return (
    <Box
      data-testid="footer"
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container as={Stack} maxW={"6xl"} py={5}>
        <SimpleGrid
          columns={2}
          spacing={8}
          alignItems={"stretch"}
          alignContent={"space-evenly"}
        >
          <Stack align={"flex-start"}>
            <ListHeader>Company</ListHeader>
            <Stack
              align={"flex-start"}
              direction={{ base: "column", md: "row" }}
              spacing={{ base: 0, md: 10 }}
            >
              <Link
                as={NextLink}
                target="_blank"
                href={"https://voluntree.net/"}
              >
                About Us
              </Link>
              <Link
                as={NextLink}
                target="_blank"
                href={"https://voluntree.net/finances/"}
              >
                Finances
              </Link>
              <Link
                as={NextLink}
                target="_blank"
                href={"https://voluntree.net/get-involved/"}
              >
                Get Involved
              </Link>
            </Stack>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Legal</ListHeader>
            <Stack
              align={"flex-start"}
              direction={{ base: "column", md: "row" }}
              spacing={{ base: 0, md: 10 }}
            >
              <Link
                as={NextLink}
                target="_blank"
                href={process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL}
              >
                Privacy Policy
              </Link>
              <Link
                as={NextLink}
                target="_blank"
                href={process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL}
              >
                Terms of Service
              </Link>
              <Link onClick={openCookieConsent}>Cookie Settings</Link>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ md: "space-between" }}
          align={"center"}
        >
          <Text align={"center"}>
            © 2024 Voluntree Community Interest Company
          </Text>
          <Stack direction={"row"} spacing={6}>
            <SocialButton
              label={"Twitter"}
              href={"https://x.com/voluntree2024"}
            >
              <FaXTwitter />
            </SocialButton>
            <SocialButton
              label={"Linkedin"}
              href={"https://www.linkedin.com/company/voluntree2024/about/"}
            >
              <FaLinkedin />
            </SocialButton>
            <SocialButton
              label={"Instagram"}
              href={"https://www.instagram.com/voluntree_community/"}
            >
              <FaInstagram />
            </SocialButton>
          </Stack>
          <Text>
            Graphics designed by{" "}
            <Link
              color={"blue.500"}
              as={NextLink}
              href="https://www.freepik.com/author/pch-vector"
            >
              pch.vector / Freepik
            </Link>
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
