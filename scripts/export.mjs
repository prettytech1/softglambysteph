// Static preview export: API routes can't be exported, so park them during the build.
import { execSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";

const api = "app/api";
const parked = "_api_parked";
const hadApi = existsSync(api);
if (hadApi) renameSync(api, parked);
try {
  execSync("next build", { stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1" } });
} finally {
  if (hadApi) renameSync(parked, api);
}
