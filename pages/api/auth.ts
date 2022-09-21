import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../shared/auth/supabase";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  auth.setAuthCookie(req, res);
};

export default handler;
