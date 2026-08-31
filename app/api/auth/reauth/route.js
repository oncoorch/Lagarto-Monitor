import { NextResponse } from "next/server";
import { currentUser, login } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const verified = await login(user.username, body.password);
    if (!verified) return NextResponse.json({ error: "Credenciales invalidas" }, { status: 401 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
