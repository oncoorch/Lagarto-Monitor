import { NextResponse } from "next/server";
import { createToken, login, setSession } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await login(body.username, body.password);
    if (!user) return NextResponse.json({ error: "Credenciales invalidas" }, { status: 401 });
    await setSession(createToken(user));
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
