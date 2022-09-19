import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Tag,
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import HeadingBar from "../../components/HeadingBar";
import Layout from "../../components/Layout";
import WorkshopCard from "../../components/WorkshopCard";
import { Workshop } from "../../shared/schemas";
import { data } from "../../shared/data/supabase";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { auth } from "../../shared/auth/supabase";

export default function Workshops({
  workshops,
  user,
}: {
  workshops: Workshop[];
  user: User;
}) {
  const { register, watch } = useForm();
  const { search } = watch();
  const [isSearching, setIsSearching] = useState(false);
  const [searchedWorkshops, setSearchWorkshops] = useState<Workshop[]>([]);
  const router = useRouter();

  const searchWorkshops = useCallback(async (str: string) => {
    const searchData = await data.searchWorkshops(str);

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
      <Box pb={2}>
        <Box p={2}>
          <Flex alignItems={"center"} justifyContent="space-between">
            {isSearching && (
              <Flex justifyContent={"center"} color="brand.700">
                <IconButton
                  size={"lg"}
                  aria-label="Search database"
                  onClick={() => {
                    setIsSearching(false);
                  }}
                  icon={<IoMdArrowBack />}
                  style={{ fontSize: "25px" }}
                />
              </Flex>
            )}
            <InputGroup display={"flex"} alignItems="center">
              {!isSearching && (
                <InputLeftElement pointerEvents="none">
                  <Search2Icon color="gray.300" />
                </InputLeftElement>
              )}
              <Input
                type="text"
                bg={isSearching ? "gray.100" : "gray.200"}
                placeholder="Search"
                border={"none"}
                {...register("search")}
                onFocus={() => setIsSearching(true)}
                focusBorderColor="transparent"
                boxShadow={"sm"}
                borderRadius="xl"
              />
            </InputGroup>
          </Flex>
        </Box>

        {!isSearching && (
          <Box px={3}>
            {workshops.length !== 0 && (
              <Box mt={2} mb={4}>
                <Heading size={"sm"}>Recent</Heading>
                <Text fontSize={"sm"} color={"gray.500"}>
                  Newly added workshops
                </Text>
              </Box>
            )}
            <SimpleGrid columns={[1, 2, 3]} spacing={3}>
              {workshops.map((w) => (
                <WorkshopCard key={w.id} workshop={w} />
              ))}
            </SimpleGrid>
          </Box>
        )}
        {isSearching && (
          <Box px={3}>
            <SimpleGrid columns={[1, 2, 3]} spacing={3}>
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

export async function getServerSideProps({ req }: any) {
  const user = await auth.getUserByCookie(req);

  if (!user) {
    return { props: {}, redirect: { destination: "/auth" } };
  }

  const workshops = await data.getAvailableWorkshops();
  
  return {
    props: { user, workshops },
  };
}
