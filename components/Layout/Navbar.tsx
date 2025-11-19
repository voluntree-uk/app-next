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
  MenuDivider,
  useColorModeValue,
  Stack,
  Img,
  Container,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import Show from "@components/Helpers/Show";
import { Link } from "@chakra-ui/next-js";
import { createClient } from "@util/supabase/client";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { AiOutlineUser } from "react-icons/ai";
import { MdSpaceDashboard } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

type NavLinkItem = {
  label: string;
  href: string;
};

const MAIN_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Workshops", href: "/workshops" },
  { label: "Finances", href: "/finances" },
];

const CREATE_WORKSHOP_HREF = "/workshops/new";

const NavLink = ({
  children,
  href,
  onClick,
  isActive,
}: {
  children: ReactNode;
  href: string;
  onClick?: () => void;
  isActive?: boolean;
}) => {
  const hoverBg = useColorModeValue("gray.200", "gray.700");
  const activeColor = useColorModeValue("blue.700", "blue.300");
  const activeBg = useColorModeValue("gray.100", "gray.800");

  return (
    <Link
      as={NextLink}
      px={3}
      py={2}
      rounded={"md"}
      fontWeight={isActive ? "semibold" : "medium"}
      color={isActive ? activeColor : undefined}
      bg={isActive ? activeBg : "transparent"}
      _hover={{
        textDecoration: "none",
        bg: hoverBg,
      }}
      display={"block"}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default function Navbar({ user }: { user: User | null }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  const router = useRouter();
  const pathname = usePathname();

  const getUser = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data.user);
  };

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
                {MAIN_LINKS.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href) && pathname !== CREATE_WORKSHOP_HREF);

                  return (
                    <NavLink key={link.label} href={link.href} isActive={isActive}>
                      {link.label}
                    </NavLink>
                  );
                })}
              </HStack>
              <Button
                display={{ base: "none", md: "inline-flex" }}
                size={"sm"}
                colorScheme="teal"
                variant="solid"
                onClick={() => router.push(CREATE_WORKSHOP_HREF)}
              >
                Create Workshop
              </Button>
            </HStack>
            <Flex alignItems={"center"} gap={3}>
              {!currentUser ? (
                <Button
                  variant={"ghost"}
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
                    variant={"ghost"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      bg="#0c70ab"
                      icon={<AiOutlineUser fontSize="1.5rem" />}
                    />
                  </MenuButton>
                  <MenuList
                    py={2}
                    borderRadius="lg"
                    boxShadow="lg"
                    borderColor={useColorModeValue("gray.100", "gray.700")}
                  >
                    <MenuItem
                      as={NextLink}
                      href={`/user/${currentUser?.id}`}
                      icon={<AiOutlineUser fontSize="1.2rem" />}
                      _hover={{
                        background: useColorModeValue("gray.100", "gray.700"),
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      as={NextLink}
                      href="/me/dashboard"
                      icon={<MdSpaceDashboard fontSize="1.2rem" />}
                      _hover={{
                        background: useColorModeValue("gray.100", "gray.700"),
                      }}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      onClick={async () => {
                        await createClient().auth.signOut();
                        router.refresh();
                      }}
                      icon={<FiLogOut fontSize="1.2rem" />}
                      _hover={{
                        background: useColorModeValue("red.50", "red.600"),
                        color: useColorModeValue("red.600", "white"),
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
                {MAIN_LINKS.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href) && pathname !== CREATE_WORKSHOP_HREF);

                  return (
                    <NavLink
                      key={link.label}
                      href={link.href}
                      onClick={onClose}
                      isActive={isActive}
                    >
                      {link.label}
                    </NavLink>
                  );
                })}

                <Button
                  w="full"
                  size={"sm"}
                  colorScheme="teal"
                  variant="solid"
                  onClick={() => {
                    router.push(CREATE_WORKSHOP_HREF);
                    onClose();
                  }}
                >
                  Create Workshop
                </Button>

                {!currentUser ? (
                  <Button
                    w="full"
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => {
                      router.push("/login");
                      onClose();
                    }}
                  >
                    Log in
                  </Button>
                ) : null}
              </Stack>
            </Box>
          </Show>
        </Box>
      </Container>
    </Box>
  );
}
