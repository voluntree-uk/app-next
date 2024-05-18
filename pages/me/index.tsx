import { auth } from "@auth/supabase";
import { data } from "@data/supabase";

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
    const profile = await data.getProfile(user.id);
    const workshops = await data.getUserWorkshops(user.id);
    return {
      props: { profile: profile, isMe: true, workshops: workshops },
      redirect: { destination: `/user/${user.id}` },
    };
  }
}
