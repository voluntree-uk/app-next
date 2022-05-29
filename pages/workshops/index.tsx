import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import WorkshopCard from "../../components/WorkshopCard";
import { Workshop } from "../../shared/schemas";
import { supabase } from "../../utils/supabaseClient";
import { GoSettings } from "react-icons/go";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";

export default function Workshops({ data }: { data: Workshop[] }) {
  const { register, watch } = useForm();
  const { search } = watch();
  const [isSearching, setIsSearching] = useState(false);
  const [searchedWorkshops, setSearchWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    if (search === "") {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  }, [search]);

  const searchWorkshops = useCallback(async (str: string) => {
    let { data: searchData, error } = await supabase
      .from("workshops")
      .select("*")
      .ilike("name", `%${str}%`);

    if (searchData) {
      setSearchWorkshops(searchData);
    }
  }, []);

  useEffect(() => {
    searchWorkshops(search);
  }, [search, searchWorkshops]);

  return (
    <Layout>
      {!isSearching && (
        <HeadingBar>
          <Heading
            fontSize={"md"}
            color={"white"}
            fontWeight="semibold"
            pl={8}
            pb={4}
          >
            Workshops
          </Heading>
        </HeadingBar>
      )}
      <Box bg="gray.100" h="100vh">
        <Box p={2}>
          <Flex alignItems={"center"} justifyContent="space-between">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Search2Icon color="gray.300" />
              </InputLeftElement>
              <Input
                type="tel"
                bg="gray.200"
                placeholder="Search"
                border={"none"}
                {...register("search")}
              />
            </InputGroup>
            <Flex w="15%" justifyContent={"center"} color="brand.700">
              <IconButton
                size={"lg"}
                aria-label="Search database"
                icon={
                  <GoSettings
                    style={{ transform: "rotate(90deg)", fontSize: "25px" }}
                  />
                }
              />
            </Flex>
          </Flex>
        </Box>
        {!isSearching && (
          <Box px={3}>
            <Box mt={2} mb={4}>
              <Heading size={"sm"}>Recent</Heading>
              <Text fontSize={"sm"} color={"gray.500"}>
                Newly added workshops
              </Text>
            </Box>
            <SimpleGrid columns={1} spacing={3}>
              {data.map((w) => (
                <WorkshopCard key={w.id} workshop={w} />
              ))}
            </SimpleGrid>
          </Box>
        )}
        {isSearching && (
          <Box px={3}>
            <SimpleGrid columns={1} spacing={3}>
              {searchedWorkshops.map((w) => (
                <WorkshopCard key={w.id} workshop={w} />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { data } = await supabase
    .from("workshops")
    .select("*")
    .order("created_at", { ascending: false });
  return { props: { data } };
}
