import { createClient } from "@util/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (type == "signup") {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/email-confirmed`);
  } else if (type == "recovery") {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/update-password`);
  } else {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_HOST}/`);
  }
}
