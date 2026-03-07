import { createClient } from '@util/supabase/server';
import { Providers } from './providers'
import { Metadata } from "next";
import Layout from '@components/Layout/Layout';
import { SupabaseDataAccessor } from "@data/supabase";

export const metadata: Metadata = {
  title: "Voluntree",
  applicationName: "Voluntree Platform",
  keywords: [
    "volunteering",
    "volunteer",
    "free learning",
    "direct democracy",
    "community building",
    "transparent financing",
  ],
  openGraph: {
    title: "Voluntree",
    description:
      "Totally transparent, and free to use, community built volunteering platform",
    images: ["https://platform-static-resources.s3.eu-west-1.amazonaws.com/banner.png"],
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
  }) {
  const supabase = createClient()
  const dataAccessor = new SupabaseDataAccessor(supabase);
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await dataAccessor.getProfile(user.id) : null;
  return (
    <html lang='en'>
      <body>
        <Providers>
          <Layout user={user} profile={profile}>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  )
}