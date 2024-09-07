#!/usr/bin/env -S npx tsx

import { createServer } from "http";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { existsSync } from "fs";
import { build } from "astro";
// @ts-ignore
import { Socket, Head } from "ws";
import compression from "compression";
import type { Request, Response } from "express";
import express from "express";
import createRammerhead from "rammerhead/src/server/index.js";
import { createBareServer } from "@tomphttp/bare-server-node";
import wisp from "wisp-server-node";
import chalk from "chalk";
import boxen from "boxen";
import isDocker from "is-docker";
import terminalLink from "terminal-link";

if (!existsSync("dist")) build({});

const PORT = process.env.PORT || 8080;

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);

const rammerheadScopes = [
  "/rammerhead.js",
  "/hammerhead.js",
  "/transport-worker.js",
  "/task.js",
  "/iframe-task.js",
  "/worker-hammerhead.js",
  "/messaging",
  "/sessionexists",
  "/deletesession",
  "/newsession",
  "/editsession",
  "/needpassword",
  "/syncLocalStorage",
  "/api/shuffleDict",
  "/mainport",
];
const rammerheadSession = /^\/[a-z0-9]{32}/;

function shouldRouteRammerhead(req: any) {
  const url = new URL(req.url, "http://0.0.0.0");
  return (
    rammerheadScopes.includes(url.pathname) ||
    rammerheadSession.test(url.pathname)
  );
}

function routeRammerheadRequest(
  rammerhead: createRammerhead,
  req: any,
  res: any,
) {
  rammerhead.emit("request", req, res);
}

function routeRammerheadUpgrade(
  rammerhead: createRammerhead,
  req: any,
  socket: any,
  head: any,
) {
  rammerhead.emit("upgrade", req, socket, head);
}

const rammerhead = createRammerhead();
const bare = createBareServer("/bare/");

const staticOptions = {
  setHeaders: (res: Response, path: string) => {
    if (path.endsWith(".cjs")) {
      res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    }
  },
};

app.use(express.static(join(__dirname, "dist"), staticOptions));
app.use(compression());

app.use((req, res, next) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else if (shouldRouteRammerhead(req)) {
    routeRammerheadRequest(rammerhead, req, res);
  } else next();
});

server.on("upgrade", (req: Request, socket: Socket, head: Head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    if (req.url && req.url.endsWith("/wisp/")) {
      wisp.routeRequest(req, socket, head);
    } else if (shouldRouteRammerhead(req)) {
      routeRammerheadUpgrade(rammerhead, req, socket, head);
    } else socket.end();
  }
});

server.listen({ port: PORT }, () => {
  if (!isDocker()) {
    console.log(
      "\n\n" +
        chalk.whiteBright("Server listening on port ") +
        chalk.green(String(PORT)) +
        "\n\n" +
        boxen(chalk.bold.gray("INFO"), {
          backgroundColor: "blue",
          borderColor: "blueBright",
          width: 12,
          height: 5,
          padding: 1,
          textAlignment: "center",
        }) +
        "\n\n" +
        chalk.redBright(`Directory: ${__dirname}`) +
        "\n\n" +
        chalk.blueBright("Framework: Astro " + chalk.bold.yellow(":3")) +
        "\n\n" +
        chalk.hex("#f1f1f1").bold("Credits") +
        "\n\n" +
        terminalLink("mercury workshop", "https://github.com/MercuryWorkshop") +
        "\n" +
        terminalLink(
          "titanium network",
          "https://github.com/titaniumnetwork-dev",
        ) +
        "\n",
    );
  }
});
