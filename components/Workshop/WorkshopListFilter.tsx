import { Box, HStack, Input, Select } from "@chakra-ui/react";
import { capitalize } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import config from "../../app-config";
import { FilterProps, DefaultFilterProps } from "../../shared/schemas";

interface IProps {
  onFilterChange(filter: any): void;
}

export default function WorkshopListFilter({ onFilterChange }: IProps) {
  const { register, watch } = useForm<FilterProps>({
    defaultValues: DefaultFilterProps
  });

  React.useEffect(() => {
    const subscription = watch((data) => {
      console.log("Filter change!")
      onFilterChange(data)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [watch]);

  return (
    <Box pb="7" display={{ base: "none", md: "block" }} w="800px">
      <HStack spacing={1}>
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
          {config.categories.map((c) => (
            <option key={c} value={c}>
              {capitalize(c)}
            </option>
          ))}
        </Select>
        <Select
          fontWeight={"semibold"}
          rounded={"full"}
          bg="gray.100"
          {...register("time")}
        >
          {config.timeFilters.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </HStack>
    </Box>
  );
}
