import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import React from "react";
import config from "../../app-config";

interface IProps {
  onFilterChange(filter: any): void;
}

export default function WorkshopListFilter(props: IProps) {
  return (
    <Box mb="6" display={{ base: "none", md: "block" }}>
      <HStack spacing={1}>
        <Input placeholder="Search for keywords" name="search" />
        <Select placeholder="Category" w="container.sm">
          {config.categories.map((c) => (
            <option key={c} value={c}>
              {capitalize(c)}
            </option>
          ))}
        </Select>
        <Select w="container.sm">
          <option>Any day</option>
          <option>Tomorrow</option>
          <option>This weekend</option>
          <option>Next week</option>
        </Select>
      </HStack>
    </Box>
  );
}
