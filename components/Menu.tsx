import React from "react";

import { ReactNode } from "react";

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Divider,
} from "@chakra-ui/react";

import { IconType } from "react-icons";
import { ReactText } from "react";
import { useRouter } from "next/router";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

import {
  MdCalendarToday,
  MdPersonOutline,
  MdWorkOutline,
} from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import { BiBookAdd } from "react-icons/bi";
import Footer from "./Footer";
import { useSession } from "../utils/hooks";
import config from "../app-config";
import { capitalize } from "lodash";
import { Logo } from "./Logo";

interface LinkItemProps {
  name: string;
  href: string;
  icon: IconType;
  sub?: boolean;
}

export default function Menu({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh">
      <>
        <SidebarContent
          display={{ base: "none", md: "block" }}
          onClose={() => onClose}
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} />
      </>
      <Box ml={{ base: 0, md: 60 }} bg="gray.100" minH={"100vh"}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();

  const session = useSession();

  const categoryLinkItems = config.categories.map((category) => {
    return {
      name: capitalize(category),
      icon: FiMenu,
      href: `/workshops/category/${category}`,
      sub: true,
    };
  }) as any;

  const LinkItems: Array<LinkItemProps> = [
    {
      name: session?.user?.email || "Profile",
      icon: MdPersonOutline,
      href: "/myprofile",
    },
    { name: "My Bookings", icon: BiBookAdd, href: "/mybookings" },
    { name: "Browse Workshops", icon: MdCalendarToday, href: "/workshops" },
    ...categoryLinkItems,
    { name: "My Workshops", icon: MdWorkOutline, href: "/myworkshops" },
    { name: "FAQ", icon: AiOutlineQuestionCircle, href: "/faq" },
  ];

  return (
    <Box
      transition="3s ease"
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        justifyContent="space-between"
        bg="brand.800"
      >
        <Logo mx={8} color="white" />
        <CloseButton
          display={{ base: "flex", md: "none" }}
          color="white"
          onClick={onClose}
          mx={8}
          size="lg"
        />
      </Flex>

      {LinkItems.map((link) => (
        <Box key={link.name}>
          <NavItem
            icon={link.icon}
            mx={link.sub ? "6" : "2"}
            color={link.sub ? "gray.500" : "gray.600"}
            onClick={() => {
              router.push(link.href);
              onClose();
            }}
          >
            {link.name}
          </NavItem>
          <Divider />
        </Box>
      ))}
      <Box h="100%"></Box>
      <Footer />
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="3"
        role="group"
        cursor="pointer"
        _hover={{
          color: "gray.800",
        }}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="20" color="brand.700" as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const router = useRouter();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      bg="brand.800"
      justifyContent={"space-around"}
      flexDirection={"column"}
      boxShadow="2xl"
      display={{ base: "flex", md: "none", lg: "none" }}
      {...rest}
    >
      <Flex justifyContent={{ base: "space-between" }} alignItems="center">
        <IconButton
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<HiOutlineMenuAlt1 />}
          border="none"
          size={"lg"}
          transform={"scale(1.5)"}
          color="white"
          _hover={{ bg: "brand.800" }}
          _active={{ bg: "transparent" }}
        />

        <IconButton
          variant="outline"
          aria-label="open menu"
          icon={
            router.pathname === "/users/myprofile" ? (
              <SettingsIcon />
            ) : (
              <AddIcon />
            )
          }
          onClick={() => router.push("/workshops/new")}
          border="none"
          size={"xs"}
          transform={"scale(1.5)"}
          color="white"
          bg="brand.700"
          borderRadius={"full"}
          mr="4"
          _hover={{ bg: "brand.700" }}
          _active={{ bg: "transparent" }}
        />
      </Flex>
    </Flex>
  );
};
