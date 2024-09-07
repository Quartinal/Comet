import { defineConfig } from "astro/config";
import { viteStaticCopy } from "vite-plugin-static-copy";
// @ts-ignore
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
// @ts-ignore
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
// @ts-ignore
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
// @ts-ignore
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { scramjetPath } from "@mercuryworkshop/scramjet";
import { uvPath as ultravioletPath } from "@titaniumnetwork-dev/ultraviolet";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: bareModulePath,
            dest: "",
            rename: "baremodule",
          },
          {
            src: baremuxPath,
            dest: "",
            rename: "baremux",
          },
          {
            src: epoxyPath,
            dest: "",
            rename: "epoxy",
          },
          {
            src: libcurlPath,
            dest: "",
            rename: "libcurl",
          },
          {
            src: scramjetPath,
            dest: "",
            rename: "scramjet",
            overwrite: false,
          },
          {
            src: ultravioletPath,
            dest: "",
            rename: "ultraviolet",
            overwrite: false,
          },
          {
            src: "public/scramjet/scramjet.config.js",
            dest: "scramjet",
          },
          {
            src: "public/ultraviolet/uv.config.js",
            dest: "ultraviolet",
          },
        ],
      }),
    ],
  },
  integrations: [preact()],
});
