import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "smol-toml";

export interface TomlData {
  env: {
    env_url: ".env" | `.env.${string}`;
  };
  db_config: {
    name: string;
    username: string;
    password: string;
  };
}

const doc = readFileSync(join(import.meta.dirname, "./config.toml")).toString();
export const parsedTomlDoc = parse(doc) as unknown as TomlData;
