import { ReactNode, useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Stack,
  Img,
  Divider,
  Container,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import Show from "@components/Helpers/Show";
import { Link } from "@chakra-ui/next-js";
import { createClient } from "@util/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { AiOutlineUser } from "react-icons/ai";

const Links = [
  { label: "Find workshops", href: "/workshops" },
  { label: "Create workshop", href: "/workshops/new" },
];

const NavLink = ({
  children,
  href,
  onClick,
}: {
  children: ReactNode;
  href: string;
  onClick?: () => void;
}) => {
  return (
    <Link
      as={NextLink}
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      display={{
        base: "block",
        md: "block",
      }}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default function Navbar({ user }: { user: User|null }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  const router = useRouter();

  const getUser = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data.user);
  }

  useEffect(() => {
    getUser();
  }, [user]);

  return (
    <Box
      borderBottom="1px"
      borderBottomColor={"gray.100"}
      backgroundColor="white"
      as="header"
      position="fixed"
      w="100%"
      zIndex={200}
    >
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
              <Link href={"/"}>
                <Box>
                  <Img
                    height={"45px"}
                    cursor="pointer"
                    src="https://avatars.githubusercontent.com/u/93862968?s=400&u=e306baa9eeb66de4ea0b6b97058c68d44d503cf0&v=4"
                  ></Img>
                </Box>
              </Link>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {Links.map((link) => (
                  <NavLink key={link?.label} href={link?.href}>
                    {link.label}
                  </NavLink>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              {!currentUser ? (
                <Button
                  variant={"text"}
                  size={"sm"}
                  onClick={() => router.push("/login")}
                >
                  Log in
                </Button>
              ) : null}
              <Show showIf={currentUser != null}>
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
                      bg="#0c70ab"
                      icon={<AiOutlineUser fontSize="1.5rem" />}
                    />
                  </MenuButton>
                  <MenuList>
                    <Link as={NextLink} href={`/user/${currentUser?.id}`}>
                      <MenuItem>View profile</MenuItem>
                    </Link>
                    <Link as={NextLink} href="/me/dashboard">
                      <MenuItem>Dashboard</MenuItem>
                    </Link>
                    <Divider />
                    <MenuItem
                      onClick={async () => {
                        await createClient().auth.signOut();
                        router.refresh();
                      }}
                    >
                      Log out
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Show>
            </Flex>
          </Flex>
          <Show showIf={isOpen}>
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link?.label} href={link?.href} onClick={onClose}>
                    {link.label}
                  </NavLink>
                ))}
              </Stack>
            </Box>
          </Show>
        </Box>
      </Container>
    </Box>
  );
}
