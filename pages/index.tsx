import enforceAuthenticated from "../utils/enforceAuthenticated";

export default function Home() {
  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}></div>
  );
}

export const getServerSideProps = enforceAuthenticated();
