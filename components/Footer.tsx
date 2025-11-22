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
import { defaultDonationUrl } from "@data/finances";

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"700"} fontSize={"lg"} mb={2}>
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
      target="_blank"
      rel="noreferrer"
      aria-label={label}
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
  openCookieConsent,
}: {
  openCookieConsent: () => void;
}) {
  return (
    <Box
      data-testid="footer"
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container as={Stack} maxW={"7xl"} py={8} px={{ base: 6, md: 16 }}>
        <SimpleGrid
          columns={{ base: 2, md: 4 }}
          spacing={8}
          alignItems={"flex-start"}
        >
          <Stack
            align={"flex-start"}
            pl={{ base: 6, md: 0 }}
          >
            <ListHeader>Explore</ListHeader>
            <Link as={NextLink} href={"/"}>
              Home
            </Link>
            <Link as={NextLink} href={"/workshops"}>
              Workshops
            </Link>
          </Stack>

          <Stack
            align={"flex-start"}
            pl={{ base: 6, md: 0 }}
          >
            <ListHeader>Support</ListHeader>
            <Link as={NextLink} href={"/finances"}>
              Finances
            </Link>
            <Link as={NextLink} href={defaultDonationUrl} target="_blank">
              Donate
            </Link>
            <Link
              as={NextLink}
              target="_blank"
              href={"https://voluntree.net/get-involved/"}
            >
              Get involved
            </Link>
          </Stack>

          <Stack
            align={"flex-start"}
            pl={{ base: 6, md: 0 }}
          >
            <ListHeader>Company</ListHeader>
            <Link
              as={NextLink}
              target="_blank"
              href={"https://voluntree.net/"}
            >
              About us
            </Link>
            <Link
              as={NextLink}
              target="_blank"
              href={"https://voluntree.net/get-involved/"}
            >
              Contact
            </Link>
          </Stack>

          <Stack
            align={"flex-start"}
            pl={{ base: 6, md: 0 }}
          >
            <ListHeader>Legal</ListHeader>
            <Link
              as={NextLink}
              target="_blank"
              href={process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL}
            >
              Privacy policy
            </Link>
            <Link
              as={NextLink}
              target="_blank"
              href={process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL}
            >
              Terms of service
            </Link>
            <Link onClick={openCookieConsent}>
              Cookie settings
            </Link>
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
          maxW={"7xl"}
          py={5}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ md: "space-between" }}
          align={"center"}
        >
          <Text textAlign="center">© 2025 Voluntree Community Interest Company</Text>
          <Stack direction={"row"} spacing={6}>
            <SocialButton
              label={"LinkedIn"}
              href={"https://www.linkedin.com/company/voluntreecommunity/"}
            >
              <FaLinkedin />
            </SocialButton>
            <SocialButton
              label={"Instagram"}
              href={"https://www.instagram.com/voluntree_community/"}
            >
              <FaInstagram />
            </SocialButton>
            <SocialButton
              label={"X (Twitter)"}
              href={"https://x.com/voluntree2024"}
            >
              <FaXTwitter />
            </SocialButton>
          </Stack>
          <Text textAlign="center">
            Graphics designed by{" "}
            <Link
              color={"blue.500"}
              as={NextLink}
              href="https://www.freepik.com/author/pch-vector"
              target="_blank"
            >
              pch.vector / Freepik
            </Link>
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
