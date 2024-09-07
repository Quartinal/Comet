// @ts-nocheck
import { storage } from "./localStorage.ts";
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

export async function registerSW() {
  const url = new URL(String(location)).searchParams;

  await (setupBareMux() &&
    (url.get("adblocker") && url.get("adblocker") === "on"
      ? navigator.serviceWorker
          .register("/sw-blacklisted.js", {
            scope: "/",
          })
          .then(reg => reg.update())
      : navigator.serviceWorker
          .register("/sw.js", {
            scope: "/",
          })
          .then(reg => reg.update())));
}

async function setupBareMux() {
  const wispUrl =
    (location.protocol === "https:" ? "wss" : "ws") +
    "://" +
    origin.replace(
      (location.protocol === "https:" ? "https" : "http") + "://",
      "",
    ) +
    "/wisp/";

  const bareUrl =
    (location.protocol === "https:" ? "https" : "http") +
    "://" +
    origin.replace(
      (location.protocol === "https:" ? "https" : "http") + "://",
      "",
    ) +
    "/bare/";

  const transport = (await storage.get("transport")) || "epoxy";

  const connection = new BareMuxConnection("/baremux/worker.js");

  await connection.setTransport(
    transport === "epoxy"
      ? "/epoxy/index.mjs"
      : transport === "libcurl"
        ? "/libcurl/index.mjs"
        : "/baremodule/index.mjs",
    transport === "epoxy" || transport === "libcurl"
      ? [{ wisp: wispUrl }]
      : [bareUrl],
  );

  console.log(`Set transport to "/${transport}/index.mjs"`);
}