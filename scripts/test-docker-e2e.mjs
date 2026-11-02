import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

if (Number(process.versions.node.split(".")[0]) !== 24) {
  throw new Error("Use Node.js 24 to run production E2E.");
}
const name = `portfolio-e2e-${randomUUID()}`;
const image = `my-website:e2e-${process.pid}`;
const temporaryDirectory = mkdtempSync(join(tmpdir(), "portfolio-e2e-"));
const buildEnv = join(temporaryDirectory, "build.env");
writeFileSync(buildEnv, "NEXT_PUBLIC_SITE_URL=https://example.test\n");
let containerStarted = false;
const run = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", ...options });
    child.on("error", reject);
    child.on("exit", (code, signal) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} failed: ${code ?? signal}`)),
    );
  });
const read = (args) => {
  const result = spawnSync("docker", args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};
try {
  await run("docker", [
    "build",
    "--secret",
    `id=production_env,src=${buildEnv}`,
    "-t",
    image,
    ".",
  ]);
  await run("docker", [
    "run",
    "-d",
    "--name",
    name,
    "-p",
    "127.0.0.1::3000",
    image,
  ]);
  containerStarted = true;
  const port = read(["port", name, "3000/tcp"]).split(":").at(-1);
  const dockerHost = process.env.E2E_DOCKER_HOST ?? "127.0.0.1";
  const baseURL = `http://${dockerHost}:${port}`;
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`${baseURL}/api/health`, {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* Wait for this container, with a bounded deadline. */
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error("Production container did not become ready.");
  await run(
    process.execPath,
    ["node_modules/playwright/cli.js", "test", ...process.argv.slice(2)],
    {
      env: { ...process.env, PLAYWRIGHT_BASE_URL: baseURL },
    },
  );
} catch (error) {
  if (containerStarted)
    spawnSync("docker", ["logs", name], { stdio: "inherit" });
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (containerStarted)
    spawnSync("docker", ["rm", "-f", name], { stdio: "inherit" });
  spawnSync("docker", ["image", "rm", image], { stdio: "ignore" });
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
