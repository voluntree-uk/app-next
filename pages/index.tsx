import { Box, Spinner } from "@chakra-ui/react";
import { auth } from "../shared/auth/supabase";

export default function Home() {
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

export async function getServerSideProps({ req }: any) {
  const user = await auth.getUserByCookie(req);

  if (user) {
    return { props: { user }, redirect: { destination: "/workshops" } };
  }

  return { props: {}, redirect: { destination: "/auth" } };
}
