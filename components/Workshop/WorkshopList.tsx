import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Img,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import WorkshopCard from "./WorkshopListCard";
import WorkshopListFilter from "./WorkshopListFilter";
import { data } from "../../shared/data/supabase";
import { useEffect, useState } from "react";
import { FilterProps, DefaultFilterProps } from "../../shared/schemas";
import { useRecoilState } from "recoil";
import { globalSearchState } from "../../shared/recoil/atoms";
import { useAsync } from "@react-hookz/web";
import Link from "next/link";

interface IProps {
  hideFilter?: boolean;
}

export default function WorkshopList({ hideFilter }: IProps) {
  const [globalSearch] = useRecoilState(globalSearchState);

  const [filter, setFilter] = useState<FilterProps>(DefaultFilterProps);

  const [workshops, workshopsActions] = useAsync(() =>
    data.filterAvailableWorkshops(filter)
  );

  useEffect(() => {
    workshopsActions.execute();
  }, [filter, globalSearch, workshopsActions]);

  function scroll() {
    window.scrollTo({ top: 300, left: 0, behavior: "smooth" });
  }
  return (
    <Box>
      <Box my="20">
        <Center pb="8">
          <Heading size={"3xl"} fontWeight="400" letterSpacing={"wide"}>
            Recent workshops
          </Heading>
        </Center>

        <Center>
          <Text textAlign={"center"} fontSize={"xl"} fontWeight="light" w="50%">
            Browse the workshops recently added by volunteers in your community.
            Use the filters to find a category you are looking for.
          </Text>
        </Center>
      </Box>

      <Container maxW={"container.md"}>
        {!hideFilter ? (
          <WorkshopListFilter
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        ) : null}

        <Stack overflow="scroll" spacing={2} w="fit-content">
          {workshops.result?.slice(0, 3).map((w) => (
            <WorkshopCard key={w.id} workshop={w} />
          ))}
        </Stack>

        {workshops.result?.length && !filter.category ? (
          <Flex justifyContent={"space-around"} mb="2" mt="2">
            <Center mb="7" mt="4">
              <Box
                borderWidth={"1px"}
                borderColor="blue.600"
                color="blue.600"
                p="10"
                py="8"
                rounded={"2xl"}
                _hover={{ bg: "blue.600", color: "white", cursor: "pointer" }}
                onClick={() => {
                  setFilter((prev) => {
                    return { ...prev, category: "technology" };
                  });

                  scroll();
                }}
              >
                <Heading fontWeight={"semibold"} size={"md"}>
                  Technology
                </Heading>
              </Box>

              <Box
                borderWidth={"1px"}
                borderColor="pink.600"
                color="pink.600"
                p="10"
                py="8"
                mx="8"
                rounded={"2xl"}
                _hover={{
                  bg: "pink.600",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setFilter((prev) => {
                    return { ...prev, category: "finance" };
                  });

                  scroll();
                }}
              >
                <Heading fontWeight={"semibold"} size={"md"}>
                  Finance
                </Heading>
              </Box>

              <Box
                borderWidth={"1px"}
                borderColor="cyan.600"
                color="cyan.600"
                p="10"
                py="8"
                rounded={"2xl"}
                _hover={{ bg: "cyan.600", color: "white", cursor: "pointer" }}
                onClick={() => {
                  setFilter((prev) => {
                    return { ...prev, category: "languages" };
                  });

                  scroll();
                }}
              >
                <Heading fontWeight={"semibold"} size={"md"}>
                  Languages
                </Heading>
              </Box>
            </Center>
          </Flex>
        ) : null}

        <Stack overflow="scroll" spacing={2} w="fit-content">
          {workshops.result?.slice(3).map((w) => (
            <WorkshopCard key={w.id} workshop={w} />
          ))}
        </Stack>
      </Container>

      {workshops.status === "loading" ? (
        <Flex justifyContent={"center"} py="20">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="black"
            size="xl"
          />
        </Flex>
      ) : null}

      {!workshops.result?.length && workshops.status === "success" ? (
        <Flex direction={"column"} alignItems="center" py="28">
          <Heading size={"sm"} pb="2">
            Sorry, there are no events results that match these filters
          </Heading>
          <Text>Try resetting the filters</Text>
        </Flex>
      ) : null}
    </Box>
  );
}
