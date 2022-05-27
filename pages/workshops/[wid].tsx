import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import { supabase } from "../../utils/supabaseClient";

export default function Workshop() {
  const router = useRouter();

  const { wid } = router.query;

  const [workshop, setWorkshop] = React.useState<any>();

  const getWorkshop = React.useCallback(async () => {
    if (wid) {
      let { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", wid);

      if (data) {
        setWorkshop(data[0]);
      }
    }
  }, [wid]);

  React.useEffect(() => {
    getWorkshop();
  }, [getWorkshop]);

  return (
    <Layout>
      <Box></Box>
    </Layout>
  );
}
