import Account from "../components/Account";
import enforceAuthenticated from "../utils/enforceAuthenticated";
import { useSession } from "../utils/hooks";

export default function Home() {
  const session = useSession();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {session && session.user ? <Account session={session} /> : null}
    </div>
  );
}

export const getServerSideProps = enforceAuthenticated();
