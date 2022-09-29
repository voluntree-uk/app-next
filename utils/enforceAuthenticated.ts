import { GetServerSideProps } from "next";
import { auth } from "../shared/auth/supabase";

const enforceAuthenticated: (
  inner?: GetServerSideProps
) => GetServerSideProps = (inner) => {
  return async (context) => {
    const { req } = context;
    const user = await auth.getUserByCookie(context.req);

    if (!user) {
      return { props: {}, redirect: { destination: "/" } };
    }

    if (inner) {
      return inner(context);
    }

    return { props: { user } };
  };
};

export default enforceAuthenticated;
