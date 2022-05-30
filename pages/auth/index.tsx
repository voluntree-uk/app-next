import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import AuthenticationForm from "../../components/AuthenticationForm";
import enforceRedirect from "../../utils/enforceRedirect";
import { useSession } from "../../utils/hooks";
import { supabase } from "../../utils/supabaseClient";

export default function Authentication() {
  return <AuthenticationForm />;
}

export async function getServerSideProps({ req }: any) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (user) {
    return { props: {}, redirect: { destination: "/workshops" } };
  }

  return { props: {} };
}
