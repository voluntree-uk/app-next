import React from "react";
import Auth from "../../components/Auth";
import enforceRedirect from "../../utils/enforceRedirect";

export default function Index() {
  return <Auth />;
}

export const getServerSideProps = enforceRedirect();
