import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return session;
}
