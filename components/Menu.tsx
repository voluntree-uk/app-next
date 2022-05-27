import React from "react";

import { ReactNode } from "react";

import {
  IconButton,
  Avatar,
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
} from "@chakra-ui/react";

import { IconType } from "react-icons";
import { ReactText } from "react";
import { useRouter } from "next/router";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { MdCalendarToday, MdLogout } from "react-icons/md";

import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BiBell } from "react-icons/bi";
import { FaHouseUser } from "react-icons/fa";

interface LinkItemProps {
  name: string;
  href: string;
  icon: IconType;
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
      <Box ml={{ base: 0, md: 60 }}>{children}</Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();

  const LinkItems: Array<LinkItemProps> = [
    { name: "Profile", icon: FaHouseUser, href: "/users/myprofile" },
    { name: "Workshops", icon: MdCalendarToday, href: "/workshops" },
    { name: "FAQ", icon: AiOutlineQuestionCircle, href: "/faq" },
    { name: "Sign out", icon: MdLogout, href: "/login" },
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
      <Flex h="20" alignItems="center" mx="8" justifyContent="flex-end">
        <CloseButton
          display={{ base: "flex", md: "none" }}
          color="brand.700"
          onClick={onClose}
          size="lg"
        />
      </Flex>

      <Box mx={10}>
        <Avatar
          size="lg"
          name="Harry Davies"
          src="https://bit.ly/kent-c-dodds"
          mb={4}
        />
      </Box>

      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          onClick={() => {
            router.push(link.href);
            onClose();
          }}
        >
          {link.name}
        </NavItem>
      ))}
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
        p="4"
        mx="8"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "brand.700",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="20"
            _groupHover={{
              color: "white",
            }}
            color="brand.700"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
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
        />

        <IconButton
          variant="outline"
          aria-label="open menu"
          icon={<BiBell />}
          border="none"
          size={"xs"}
          transform={"scale(1.5)"}
          color="white"
          bg="brand.700"
          borderRadius={"full"}
          mr="4"
        />
      </Flex>
    </Flex>
  );
};
