import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";
import { Session } from "@supabase/supabase-js";
import enforceAuthenticated from "../utils/enforceAuthenticated";
import { useSession } from "../utils/hooks";

export default function Home() {
  const session = useSession();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : null}
    </div>
  );
}

export const getServerSideProps = enforceAuthenticated();
