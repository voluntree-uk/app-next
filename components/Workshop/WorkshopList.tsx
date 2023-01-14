import {
  Box,
  Button,
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
import {
  FilterProps,
  DefaultFilterProps,
  TimeFilter,
} from "../../shared/schemas";
import { useAsync } from "@react-hookz/web";
import { IoMdCloseCircle, IoMdCloseCircleOutline } from "react-icons/io";
import router from "next/router";

interface IProps {
  hideFilter?: boolean;
}

export default function WorkshopList({ hideFilter }: IProps) {
  const [filter, setFilter] = useState<FilterProps>(DefaultFilterProps);

  const [workshops, workshopsActions] = useAsync(() =>
    data.filterAvailableWorkshops(filter)
  );

  useEffect(() => {
    workshopsActions.execute();
  }, [filter, workshopsActions]);

  function scroll() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  const filterActive = () => {
    return Boolean(
      filter.category || filter.time !== TimeFilter.ANY_TIME || filter.text
    );
  };
  return (
    <Box>
      <Container maxW={"container.md"} mt="20">
        {!hideFilter ? (
          <WorkshopListFilter
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        ) : null}

        <Center my="12">
          <Text
            fontWeight={"normal"}
            fontSize={"2xl"}
            display="flex"
            alignItems={"center"}
          >
            <strong style={{ paddingRight: "5px" }}>
              {workshops.result?.length}
            </strong>
            workshops in
            <strong style={{ paddingLeft: "5px", paddingRight: "5px" }}>
              {filter.category || "all categories"}
            </strong>
            {filter.category !== "" && (
              <IoMdCloseCircle
                fontSize={"30px"}
                style={{
                  display: "inline",
                  paddingRight: "5px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setFilter((prev) => {
                    return {
                      ...prev,
                      category: "",
                    };
                  })
                }
              />
            )}
            at
            <strong style={{ paddingLeft: "5px", paddingRight: "5px" }}>
              {filter.time.toLowerCase()}
            </strong>
            {filter.time !== TimeFilter.ANY_TIME && (
              <IoMdCloseCircle
                fontSize={"30px"}
                style={{
                  display: "inline",
                  paddingRight: "5px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setFilter((prev) => {
                    return {
                      ...prev,
                      time: TimeFilter.ANY_TIME,
                    };
                  })
                }
              />
            )}
            {filterActive() && (
              <Flex alignItems={"center"} color="gray.500">
                <Text style={{ paddingLeft: "10px", paddingRight: "5px" }}>
                  Clear all filters
                </Text>
                <IoMdCloseCircleOutline
                  fontSize={"30px"}
                  style={{
                    display: "inline",
                    paddingRight: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => setFilter(DefaultFilterProps)}
                />
              </Flex>
            )}
          </Text>
        </Center>

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
                w="100%"
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
                w="100%"
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
                w="100%"
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

      <Box my="10">
        <Center mb="8" color="gray.500" fontWeight={"semibold"}>
          <Text>Showing 10 out of 86</Text>
        </Center>

        <Center pb={{ base: "24", sm: "36" }}>
          <Button
            color={"white"}
            size="lg"
            bg="black"
            border="1px solid white"
            rounded={"full"}
            px="7"
            py="7"
            fontWeight={"light"}
            _hover={{
              bg: "transparent",
              color: "black",
              border: "1px solid black",
            }}
          >
            Load more
          </Button>
        </Center>
      </Box>

      {!workshops.result?.length && workshops.status === "success" ? (
        <Center py="28">
          <Heading
            size="lg"
            fontWeight={"light"}
            textAlign={"center"}
            w="60%"
            pb="2"
          >
            Wow, this is awkward... We don’t have any workshops that match your
            search right now. Why not change things up a bit and try removing
            some filters?
          </Heading>
        </Center>
      ) : null}
    </Box>
  );
}
