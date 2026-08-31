import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

const controls = [
  { key: "ssh_alerts", name: "Alertas SSH", enabled: true, description: "Notifica accesos SSH al VPS NICOP." },
  { key: "docker_watch", name: "Docker Watch", enabled: true, description: "Vigila consumo y reinicios de contenedores." },
  { key: "firewall", name: "Firewall", enabled: true, description: "Control defensivo con UFW y reglas publicadas." },
  { key: "fail2ban", name: "Fail2ban", enabled: true, description: "Bloqueo automatico de intentos repetidos." },
  { key: "wazuh", name: "Wazuh", enabled: false, description: "EDR/SIEM opensource recomendado para fase 2." },
];

export async function GET() {
  try {
    await requireUser();
    return NextResponse.json({ controls });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
