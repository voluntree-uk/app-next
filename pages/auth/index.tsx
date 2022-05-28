import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import SignIn from "../../components/signIn";
import enforceRedirect from "../../utils/enforceRedirect";

export default function Authentication() {
  return <SignIn />;
}

export const getServerSideProps = enforceRedirect();
