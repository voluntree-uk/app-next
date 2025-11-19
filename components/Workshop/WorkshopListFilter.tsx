"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Input, Select, Flex, Badge, VStack } from "@chakra-ui/react";
import { capitalize } from "lodash";
import { BiFilter } from "react-icons/bi";
import config from "@config";
import { FilterProps, TimeFilter, SortOption } from "@schemas";

interface IProps {
  initialFilters: FilterProps;
}

export default function WorkshopListFilter({ initialFilters }: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterProps>(initialFilters);
  const isUpdatingFromURL = React.useRef(false);
  const textTimeoutRef = React.useRef<NodeJS.Timeout>();
  const lastURLStringRef = React.useRef<string>(searchParams.toString());

  const updateURL = React.useCallback((newFilters: FilterProps) => {
    isUpdatingFromURL.current = true;
    const params = new URLSearchParams();
    if (newFilters.text) params.set("text", newFilters.text);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.time !== TimeFilter.ANY_TIME) params.set("time", newFilters.time);
    if (newFilters.sort !== SortOption.SOONEST) params.set("sort", newFilters.sort);

    const queryString = params.toString();
    const newURL = queryString ? `/workshops?${queryString}` : "/workshops";
    lastURLStringRef.current = queryString;
    router.push(newURL, { scroll: false });
    // Reset flag after a short delay to allow URL to update
    setTimeout(() => {
      isUpdatingFromURL.current = false;
    }, 100);
  }, [router]);

  // Update filters when URL searchParams change (e.g., browser back/forward)
  // Only sync from URL if we're not currently updating from user input
  useEffect(() => {
    if (isUpdatingFromURL.current) return;

    const currentURLString = searchParams.toString();
    // Skip if URL hasn't actually changed
    if (currentURLString === lastURLStringRef.current) return;

    const urlFilters = {
      text: searchParams.get("text") || "",
      category: searchParams.get("category") || "",
      time: (searchParams.get("time") as TimeFilter) || TimeFilter.ANY_TIME,
      sort: (searchParams.get("sort") as SortOption) || SortOption.SOONEST,
    };

    // Always update from URL when URL changes (e.g., browser navigation)
    lastURLStringRef.current = currentURLString;
    setFilters(urlFilters);
  }, [searchParams]);

  // Debounce text input updates - only update URL when text changes
  useEffect(() => {
    // Skip if text matches initial value (on mount)
    if (filters.text === initialFilters.text) return;

    if (textTimeoutRef.current) {
      clearTimeout(textTimeoutRef.current);
    }

    textTimeoutRef.current = setTimeout(() => {
      updateURL(filters);
    }, 500);

    return () => {
      if (textTimeoutRef.current) {
        clearTimeout(textTimeoutRef.current);
      }
    };
  }, [filters.text, updateURL, initialFilters.text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, text: e.target.value });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, time: e.target.value as TimeFilter };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, sort: e.target.value as SortOption };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleCategoryClick = (category: string) => {
    const newCategory = filters.category === category ? "" : category;
    const newFilters = { ...filters, category: newCategory };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  return (
    <VStack align="stretch" spacing={6}>
      {/* Search and Time Filter Row */}
      <Flex
        flexDir={{
          base: "column",
          md: "row",
        }}
        width="100%"
        gap={4}
      >
        <Input
          flex="1"
          rounded={"full"}
          placeholder="Search by name or description"
          type={"search"}
          h={{ base: "44px", md: "40px" }}
          minH="44px"
          value={filters.text}
          onChange={handleTextChange}
        />
        <Select
          fontWeight={"semibold"}
          rounded={"full"}
          bg="gray.100"
          w={{ base: "100%", md: "200px" }}
          h={{ base: "44px", md: "40px" }}
          minH="44px"
          value={filters.time}
          onChange={handleTimeChange}
        >
          {Object.values(TimeFilter).map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </Select>
        <Select
          fontWeight={"semibold"}
          rounded={"full"}
          bg="gray.100"
          w={{ base: "100%", md: "180px" }}
          h={{ base: "44px", md: "40px" }}
          minH="44px"
          value={filters.sort}
          onChange={handleSortChange}
        >
          <option value={SortOption.SOONEST}>Soonest first</option>
          <option value={SortOption.NEWEST}>Newest first</option>
          <option value={SortOption.MOST_POPULAR}>Most popular</option>
        </Select>
      </Flex>

      {/* Category Pills */}
      <Box>
          <Flex wrap="wrap" gap={2} align="center">
          <Box as={BiFilter} color="gray.600" fontSize="lg" mr={1} flexShrink={0} />
          <Badge
            as="button"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="semibold"
            cursor="pointer"
            transition="all 0.2s"
            bg={filters.category === "" ? "blue.500" : "gray.200"}
            color={filters.category === "" ? "white" : "gray.700"}
            _hover={{
              bg: filters.category === "" ? "blue.600" : "gray.300",
            }}
            onClick={() => handleCategoryClick("")}
          >
            All
          </Badge>
          {config.categories.map((category) => (
            <Badge
              key={category}
              as="button"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="semibold"
              cursor="pointer"
              transition="all 0.2s"
              bg={filters.category === category ? "blue.500" : "gray.200"}
              color={filters.category === category ? "white" : "gray.700"}
              _hover={{
                bg: filters.category === category ? "blue.600" : "gray.300",
              }}
              onClick={() => handleCategoryClick(category)}
            >
              {capitalize(category)}
            </Badge>
          ))}
        </Flex>
      </Box>
    </VStack>
  );
}
