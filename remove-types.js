import { removeTypes } from "remove-types";
import { readFileSync, writeFileSync } from "fs";

const fileName = "index.ts";

const originalFile = readFileSync(fileName, "utf-8");
const typelessFile = removeTypes(originalFile);

(async () => {
  writeFileSync(fileName.replace("ts", "js"), await typelessFile);
})();
