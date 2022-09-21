import { auth } from "../shared/auth/supabase";

export function useSession() {
  return auth.useSession();
}
