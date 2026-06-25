import { NextResponse } from "next/server";
import { getAdminSession } from "./session";

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { ok: false, message: "You must sign in to access the admin dashboard." },
        { status: 401 },
      ),
    };
  }

  return { session, response: null };
}
