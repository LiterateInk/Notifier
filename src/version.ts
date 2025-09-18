import { join } from "node:path";
import latest from "../latest.json";
import fs from "node:fs/promises";

export const readVersionFor = (appName: string): string => {
  return latest[appName as keyof typeof latest] || "(none)";
};

export const writeVersionFor = async (
  appName: string,
  version: string
): Promise<void> => {
  latest[appName as keyof typeof latest] = version;
  await fs.writeFile(
    join(__dirname, "../latest.json"),
    JSON.stringify(latest, null, 2),
    "utf8"
  );
};
