import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import SignIn from "../../components/signIn";
import enforceRedirect from "../../utils/enforceRedirect";
import { useSession } from "../../utils/hooks";

export default function Authentication() {
  const session = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (session?.user) {
      router.push("/users/myprofile");
    }
  }, [session, router]);

  return <SignIn />;
}

export const getServerSideProps = enforceRedirect();
