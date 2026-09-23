import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parseEnv } from "node:util";

if (process.env.NODE_ENV !== "development" || !existsSync("/.dockerenv")) {
  throw new Error(
    "El usuario de pruebas solo se configura en Docker con NODE_ENV=development.",
  );
}

const path = ".env.local";
const original = existsSync(path) ? readFileSync(path, "utf8") : "";
const current = parseEnv(original);
const username = "studio-test";
const password = "Studio-local-2026!";
const salt = "studio-development-fixture";
const hash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("base64url")}`;
const replacements = { STUDIO_USERNAME: username, STUDIO_PASSWORD_HASH: hash };
if (!current.STUDIO_SESSION_SECRET)
  replacements.STUDIO_SESSION_SECRET = randomBytes(32).toString("hex");

if (
  current.STUDIO_USERNAME !== username ||
  current.STUDIO_PASSWORD_HASH !== hash
) {
  const backup = ".env.local.studio-user-backup";
  if (!existsSync(backup)) {
    writeFileSync(
      backup,
      `${["STUDIO_USERNAME", "STUDIO_PASSWORD_HASH"]
        .filter((key) => current[key] !== undefined)
        .map((key) => `${key}=${JSON.stringify(current[key])}`)
        .join("\n")}\n`,
      { mode: 0o600 },
    );
  }
  let updated = original;
  for (const [key, value] of Object.entries(replacements)) {
    const line = `${key}=${JSON.stringify(value)}`;
    const pattern = new RegExp(`^(?:export\\s+)?${key}=.*$`, "m");
    updated = pattern.test(updated)
      ? updated.replace(pattern, line)
      : `${updated.trimEnd()}\n${line}\n`;
  }
  writeFileSync(path, updated, { mode: 0o600 });
  console.log(
    "Usuario local de pruebas configurado. Credenciales anteriores preservadas en .env.local.studio-user-backup.",
  );
} else {
  console.log(
    "El usuario local de pruebas ya está configurado; no se modificó ningún archivo.",
  );
}
console.log(`Usuario: ${username}\nContraseña local de pruebas: ${password}`);
console.log(
  "Aplica la configuración con: docker compose up -d --no-deps --force-recreate web",
);
