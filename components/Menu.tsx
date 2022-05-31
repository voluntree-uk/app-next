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

import { MdPersonOutline, MdSearch } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import { BiBookAdd } from "react-icons/bi";
import { useSession } from "../utils/hooks";
import config from "../app-config";
import { capitalize } from "lodash";
import { IoMdHelpBuoy } from "react-icons/io";

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
      name: "Me",
      icon: MdPersonOutline,
      href: "/myprofile",
    },
    { name: "Bookings", icon: BiBookAdd, href: "/mybookings", sub: true },

    { name: "Workshops", icon: MdSearch, href: "/workshops" },
    ...categoryLinkItems,
    { name: "FAQ", icon: AiOutlineQuestionCircle, href: "/faq" },
    {
      name: "Volunteer Dashboard",
      icon: IoMdHelpBuoy,
      href: "/myworkshops",
    },
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
        h="16"
        alignItems="center"
        justifyContent="space-between"
        bg="brand.800"
        mb={6}
      >
        <CloseButton
          display={{ base: "flex", md: "none" }}
          color="white"
          onClick={onClose}
          mx={8}
          size="lg"
        />
      </Flex>

      {LinkItems.map((link) => (
        <Box key={link.name} bg="white">
          <NavItem
            icon={link.icon}
            mx={link.sub ? "8" : "2"}
            color={link.sub ? "gray.500" : "gray.600"}
            bg="white"
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
      bg="white"
    >
      <Flex
        align="center"
        p="3"
        role="group"
        bg="white"
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
      h="16"
      bg={{ base: "brand.800", md: "gray.50" }}
      borderBottomWidth={{ base: "0", md: "1" }}
      borderBottomColor={{ base: "transparent", md: "1" }}
      justifyContent={"space-around"}
      flexDirection={"column"}
      boxShadow="2xl"
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
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
          display={{ base: "flex", md: "none", lg: "none" }}
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
