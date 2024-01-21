import { GetServerSideProps } from "next";
import { auth } from "@auth/supabase";

const enforceRedirect: (inner?: GetServerSideProps) => GetServerSideProps = (
  inner
) => {
  return async (context) => {
    const { req } = context;
    const user = await auth.getUserByCookie(context.req);

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
