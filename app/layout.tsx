import { createClient } from '@util/supabase/server';
import { Providers } from './providers'
import { Metadata } from "next";
import Layout from '@components/Layout/Layout';

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
    images: ["https://voluntree.net/wp-content/uploads/2024/06/banner.png"],
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
  }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <html lang='en'>
      <body>
        <Providers>
          <Layout user={user}>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  )
}