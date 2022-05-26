import React from "react";
import enforceAuthenticated from "../../utils/enforceAuthenticated";

export default function New() {
  return <div></div>;
}

export const getServerSideProps = enforceAuthenticated();
