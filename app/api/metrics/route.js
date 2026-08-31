import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { requireUser } from "@/lib/auth";

const execFileAsync = promisify(execFile);

async function dockerStats() {
  const { stdout } = await execFileAsync("docker", [
    "stats",
    "--no-stream",
    "--format",
    "{{json .}}",
  ], { timeout: 12000, maxBuffer: 1024 * 1024 * 4 });
  return stdout.trim().split("\n").filter(Boolean).map((line) => {
    const item = JSON.parse(line);
    const [memoryPart, limitPart] = String(item.MemUsage || "0MiB / 0MiB").split("/").map((part) => part.trim());
    const memoryMb = toMiB(memoryPart);
    const limitMb = toMiB(limitPart);
    return {
      id: item.Container,
      name: item.Name,
      image: item.Image,
      status: item.PIDs ? `${item.PIDs} pids` : "running",
      cpu: Number(String(item.CPUPerc || "0").replace("%", "")),
      memoryMb: Number(memoryMb.toFixed(1)),
      limitMb: Number(limitMb.toFixed(1)),
    };
  });
}

function toMiB(value) {
  const match = String(value || "").match(/^([0-9.]+)([KMG]i?B)$/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith("k")) return amount / 1024;
  if (unit.startsWith("g")) return amount * 1024;
  return amount;
}

export async function GET() {
  try {
    await requireUser();
    const containers = await dockerStats();
    const totals = containers.reduce((acc, item) => {
      acc.cpu += item.cpu;
      acc.memoryMb += item.memoryMb;
      return acc;
    }, { cpu: 0, memoryMb: 0 });
    return NextResponse.json({
      sampledAt: new Date().toISOString(),
      totals: { cpu: Number(totals.cpu.toFixed(2)), memoryMb: Number(totals.memoryMb.toFixed(1)) },
      containers,
      unit: { memory: "MB" },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
