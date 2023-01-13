import { Flex, HStack, Input, Link, Select } from "@chakra-ui/react";
import { capitalize } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import config from "../../app-config";
import { globalSearchState } from "../../shared/recoil/atoms";
import {
  FilterProps,
  DefaultFilterProps,
  TimeFilter,
} from "../../shared/schemas";

interface IProps {
  activeFilter: FilterProps;
  onFilterChange(filter: FilterProps): void;
}

export default function WorkshopListFilter({
  onFilterChange,
  activeFilter,
}: IProps) {
  const [globalSearch, setGlobalSearch] = useRecoilState(globalSearchState);

  const { register, watch, reset } = useForm<FilterProps>({
    defaultValues: DefaultFilterProps,
  });

  React.useEffect(() => {
    const subscription = watch((data) => {
      onFilterChange(data as FilterProps);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const filterState = watch();

  const filterApplied = () => {
    return (
      activeFilter.category ||
      activeFilter.time !== TimeFilter.ANY_TIME ||
      activeFilter.text
    );
  };

  const restFilters = () => {
    reset();
  };

  return (
    <Flex
      pb="12"
      display={{ base: "none", md: "flex" }}
      alignItems="center"
      justifyContent={"center"}
    >
      <HStack spacing={2}>
        <Input
          rounded={"full"}
          fontWeight="light"
          placeholder="Search"
          bg={"transparent"}
          color={"black"}
          h="12"
          borderWidth={"1px"}
          borderColor={"black"}
          boxShadow={"sm"}
          _hover={{
            borderWidth: "1px",
            borderColor: "black",
            cursor: "pointer",
          }}
          focusBorderColor="black"
          {...register("text")}
        />

        <Select
          rounded={"full"}
          fontWeight={"semibold"}
          placeholder="All Categories"
          bg={activeFilter.category ? "black" : "transparent"}
          color={activeFilter.category ? "white" : "black"}
          h="12"
          borderWidth={"1px"}
          borderColor={"black"}
          boxShadow={"sm"}
          _hover={{
            borderWidth: "1px",
            borderColor: "black",
            cursor: "pointer",
          }}
          {...register("category")}
        >
          {config.categories.map((c) => (
            <option key={c} value={c}>
              {capitalize(c)}
            </option>
          ))}
        </Select>

        <Select
          rounded={"full"}
          fontWeight={"semibold"}
          placeholder="All Categories"
          bg={
            activeFilter.time === TimeFilter.ANY_TIME ? "transparent" : "black"
          }
          color={activeFilter.time === TimeFilter.ANY_TIME ? "black" : "white"}
          h="12"
          _hover={{
            borderWidth: "1px",
            borderColor: "black",
            cursor: "pointer",
          }}
          borderWidth={"1px"}
          borderColor={"black"}
          boxShadow={"sm"}
          {...register("time")}
        >
          {config.timeFilters.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </HStack>

      {filterApplied() ? (
        <Link
          color="black"
          ml="3"
          fontWeight={"semibold"}
          _hover={{ underline: "none" }}
          onClick={restFilters}
        >
          Reset filters
        </Link>
      ) : null}
    </Flex>
  );
}
