import { GetServerSideProps } from "next";
import { supabase } from "./supabaseClient";

const enforceRedirect: (inner?: GetServerSideProps) => GetServerSideProps = (
  inner
) => {
  return async (context) => {
    const { req } = context;
    const { user } = await supabase.auth.api.getUserByCookie(req);

    if (user) {
      return { props: {}, redirect: { destination: "/workshops" } };
    }

    if (inner) {
      return inner(context);
    }

    return { props: { user } };
  };
};

export default enforceRedirect;
