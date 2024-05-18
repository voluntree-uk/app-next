import { auth } from "@auth/supabase";

export default function MePage() {
  return;
}

export async function getServerSideProps({ req }: any) {
  const user = await auth.getUserByCookie(req);

  if (!user) {
    return {
      props: {},
      redirect: { destination: "/" }
    };
  } else {
    return {
      props: { user },
      redirect: { destination: `/user/${user.id}` },
    };
  }
}
