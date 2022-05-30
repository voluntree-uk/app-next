import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../components/Layout";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/workshops");
  }, [router]);

  return (
    <Box
      h="100vh"
      bg="brand.800"
      display="flex"
      alignItems={"center"}
      justifyContent="center"
    >
      <Spinner
        thickness="10px"
        speed="0.65s"
        color="green.300"
        size="xl"
        transform={"scale(2)"}
        mb={40}
      />
    </Box>
  );
}
