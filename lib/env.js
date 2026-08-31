export function requiredEnv(name) {
  const value = process.env[name];
  if (!value || value.startsWith("change_me")) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function optionalEnv(name, fallback = "") {
  const value = process.env[name];
  return value && !value.startsWith("change_me") ? value : fallback;
}

export function parseBase64Json(name, fallback) {
  const encoded = optionalEnv(name);
  if (!encoded) return fallback;
  return JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
}
