import Layout from "../../components/Layout/Layout";
import { Workshop } from "../../shared/schemas";
import { data } from "../../shared/data/supabase";
import { User } from "@supabase/supabase-js";
import { auth } from "../../shared/auth/supabase";
import WorkshopList from "../../components/Workshop/WorkshopList";

export default function Workshops({
  workshops,
}: {
  workshops: Workshop[];
  user: User;
}) {
  return (
    <Layout>
      <WorkshopList workshops={workshops} />
    </Layout>
  );
}

export async function getServerSideProps({ req }: any) {
  const user = await auth.getUserByCookie(req);
  const workshops = await data.getAvailableWorkshops();

  return {
    props: { user, workshops },
  };
}
