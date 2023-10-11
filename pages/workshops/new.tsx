import React from "react";
import Layout from "@components/Layout/Layout";
import WorkshopForm from "@components/Workshop/WorkshopForm";
import enforceAuthenticated from "@util/enforceAuthenticated";

export default function New() {
  return (
    <Layout>
      <WorkshopForm />
    </Layout>
  );
}

export const getServerSideProps = enforceAuthenticated();
