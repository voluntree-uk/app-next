import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Img,
  Divider,
  Container,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import AuthenticationModal from "../AuthenticationModal";
import { useSession } from "../../utils/hooks";
import { auth } from "../../shared/auth/supabase";
import { authenticationModalState } from "../../shared/recoil/atoms";
import { useRecoilState } from "recoil";

const Links = [
  { label: "Find workshops", href: "/workshops" },
  { label: "Create workshop", href: "/workshops/new" },
];

const NavLink = ({
  children,
  display,
  href,
}: {
  children: ReactNode;
  href: string;
  display: {
    base: string;
    md: string;
  };
}) => {
  return (
    <NextLink passHref href={href}>
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        display={display}
        href={href}
      >
        {children}
      </Link>
    </NextLink>
  );
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const session = useSession();

  const [authModalIsOpen, setAuthModalModalIsOpen] = useRecoilState(
    authenticationModalState
  );

  return (
    <Box borderBottom="1px" borderBottomColor={"gray.100"}>
      <Container maxWidth={"7xl"} margin="0 auto">
        <Box>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={"center"}>
              <Box onClick={() => router.push("/")}>
                <Img
                  height={"45px"}
                  cursor="pointer"
                  src="https://avatars.githubusercontent.com/u/93862968?s=400&u=e306baa9eeb66de4ea0b6b97058c68d44d503cf0&v=4"
                ></Img>
              </Box>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {Links.map((link) => (
                  <NavLink
                    display={{
                      base: "block",
                      md:
                        link.label === "Create workshop" && !session?.user
                          ? "none"
                          : "block",
                    }}
                    key={link?.label}
                    href={link?.href}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              {!session?.user ? (
                <Button
                  variant={"text"}
                  size={"sm"}
                  onClick={() => setAuthModalModalIsOpen(true)}
                >
                  Log in
                </Button>
              ) : null}
              {session?.user ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={
                        "https://efhzkzupjdpnsounrzhp.supabase.co/storage/v1/object/public/avatars/default_avatar.png"
                      }
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => router.push("/me")}>
                      View profile
                    </MenuItem>
                    <MenuItem onClick={() => router.push("/me/dashboard")}>
                      Dashboard
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        auth.signOut();
                      }}
                    >
                      Log out
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : null}
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map((link) => (
                  <NavLink
                    display={{
                      base:
                        link.label === "Create workshop" && !session?.user
                          ? "none"
                          : "block",
                      md: "block",
                    }}
                    key={link?.label}
                    href={link?.href}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>

        <AuthenticationModal
          isOpen={authModalIsOpen}
          onClose={() => setAuthModalModalIsOpen(false)}
        />
      </Container>
    </Box>
  );
}
