import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { optionalEnv, requiredEnv } from "@/lib/env";

export async function POST() {
  try {
    await requireUser();
    const apiUrl = requiredEnv("EVOLUTION_API_URL").replace(/\/$/, "");
    const apiKey = requiredEnv("EVOLUTION_API_KEY");
    const instance = encodeURIComponent(optionalEnv("ALERT_WHATSAPP_INSTANCE", "NICOP USA"));
    const number = requiredEnv("ALERT_WHATSAPP_NUMBER");
    const response = await fetch(`${apiUrl}/message/sendText/${instance}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number,
        text: `Lagarto Monitor activo - ${new Date().toISOString()}`,
      }),
    });
    if (!response.ok) {
      return NextResponse.json({ error: await response.text() }, { status: response.status });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
