import Layout from "../components/Layout";

import enforceAuthenticated from "../utils/enforceAuthenticated";

export default function Home() {
  return (
    <Layout>
      <div></div>
    </Layout>
  );
}

export const getServerSideProps = enforceAuthenticated();
