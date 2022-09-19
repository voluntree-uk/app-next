import { GetServerSideProps } from "next";
import { supabase } from "../supabase/supabaseClient";

const enforceAuthenticated: (
  inner?: GetServerSideProps
) => GetServerSideProps = (inner) => {
  return async (context) => {
    const { req } = context;
    const { user } = await supabase.auth.api.getUserByCookie(req);

    if (!user) {
      return { props: {}, redirect: { destination: "/auth" } };
    }

    if (inner) {
      return inner(context);
    }

    return { props: { user } };
  };
};

export default enforceAuthenticated;
