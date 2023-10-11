import { auth } from "@auth/supabase";

export function useSession() {
  return auth.useSession();
}
