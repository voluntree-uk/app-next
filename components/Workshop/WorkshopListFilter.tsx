"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Box, HStack, Input, Select, Flex } from "@chakra-ui/react";
import { capitalize } from "lodash";
import config from "@config";
import { FilterProps, TimeFilter, DefaultFilterProps } from "@schemas";

interface IProps {
  onFilterChange(filter: any): void;
}

export default function WorkshopListFilter({ onFilterChange }: IProps) {
  const { register, watch } = useForm<FilterProps>({
    defaultValues: DefaultFilterProps,
  });

  React.useEffect(() => {
    const subscription = watch((data) => {
      onFilterChange(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  return (
    <Box
      pb="7"
      display={{ base: "flex", md: "block" }}
      w={{
        base: "100%",
        md: "750px",
      }}
    >
      <Flex
        flexDir={{
          base: "column",
          md: "row",
        }}
        width="100%"
        gap={5}
      >
        <Input
          rounded={"full"}
          placeholder="Search for keywords"
          type={"search"}
          {...register("text")}
        />
        <Select
          rounded={"full"}
          fontWeight={"semibold"}
          placeholder="All Categories"
          bg="gray.100"
          {...register("category")}
        >
          {config.categories.map((category) => (
            <option key={category} value={category}>
              {capitalize(category)}
            </option>
          ))}
        </Select>
        <Select
          fontWeight={"semibold"}
          rounded={"full"}
          bg="gray.100"
          {...register("time")}
        >
          {Object.values(TimeFilter).map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </Select>
      </Flex>
    </Box>
  );
}
