import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { parseBase64Json, requiredEnv } from "./env";

const COOKIE_NAME = "lagarto_monitor_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function sign(payload) {
  return crypto.createHmac("sha256", requiredEnv("MONITOR_SESSION_SECRET")).update(payload).digest("base64url");
}

export function users() {
  return parseBase64Json("MONITOR_USERS_B64", []).filter((user) => user.username && user.passwordHash);
}

export async function login(username, password) {
  const normalized = String(username || "").trim().toLowerCase();
  const user = users().find((item) => String(item.username).toLowerCase() === normalized);
  if (!user) return null;
  if (!await bcrypt.compare(String(password || ""), user.passwordHash)) return null;
  return { username: user.username, name: user.name || user.username, role: user.role || "viewer" };
}

export function createToken(user) {
  const payload = Buffer.from(JSON.stringify({
    username: user.username,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readToken(token) {
  if (!token?.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (signature !== sign(payload)) return null;
  const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
  return data;
}

export async function currentUser() {
  const store = await cookies();
  return readToken(store.get(COOKIE_NAME)?.value);
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  return user;
}

export async function setSession(token) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}
