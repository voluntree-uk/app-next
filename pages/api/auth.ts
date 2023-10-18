import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@auth/supabase";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  auth.setAuthCookie(req, res);
};

export default handler;
