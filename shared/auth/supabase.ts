import { useEffect, useState } from "react";
import { supabase } from "@supabaseClient";
import { User, Session } from "@schemas";
import { Auth } from "./auth";

class SupabaseAuth implements Auth {
  async getUser(): Promise<User|null> {
    return supabase.auth.user();
  }

  async getUserByCookie(request: any): Promise<User | null> {
    return (await supabase.auth.api.getUserByCookie(request)).user;
  }

  async signIn(email: string, password: string): Promise<boolean> {
    const { error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });

    if (error) throw error;

    return true;
  }

  async signUp(email: string, password: string): Promise<User|null> {
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) throw error;

    return user;
  }

  async signOut(): Promise<boolean> {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return true;
  }

  setAuthCookie(req: any, res: any): void {
    supabase.auth.api.setAuthCookie(req, res);
  }

  useSession(): Session | null {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
      setSession(supabase.auth.session());

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    }, []);

    return session;
  }

  updateCookieOnAuthChange(): void {
    useEffect(() => {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          await fetch("/api/auth", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            credentials: "same-origin",
            body: JSON.stringify({ event, session }),
          });
        }
      );

      return () => {
        authListener?.unsubscribe();
      };
    });
  }
  
}

export const auth = new SupabaseAuth();