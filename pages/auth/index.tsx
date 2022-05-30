import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import AuthenticationForm from "../../components/AuthenticationForm";
import enforceRedirect from "../../utils/enforceRedirect";
import { useSession } from "../../utils/hooks";

export default function Authentication() {
  return <AuthenticationForm />;
}

export const getServerSideProps = enforceRedirect();
