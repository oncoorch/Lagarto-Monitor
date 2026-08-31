import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { parseBase64Json } from "@/lib/env";

export async function GET() {
  try {
    await requireUser();
    const resources = parseBase64Json("MONITOR_RESOURCES_B64", { groups: [] });
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
