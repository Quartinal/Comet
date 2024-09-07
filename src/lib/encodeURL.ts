import type { UVConfig as UltravioletConfig } from "@titaniumnetwork-dev/ultraviolet";
import type { Config as MeteorConfig } from "meteorproxy";

declare global {
  var __uv$config: Required<UltravioletConfig>;

  var __scramjet$config: {
    prefix: `/${string}/`;
    config: `/${string}.js`;
    bundle: `/${string}.js`;
    worker: `/${string}.js`;
    client: `/${string}.js`;
    codecs: `/${string}.js`;
    codec: {
      encode: (url: string) => string;
      decode: (url: string) => string;
    };
  };

  var $meteor_config: Required<MeteorConfig>;
}

/** the base proxies class */
export class Proxies {
  /**
   * encodes based on the currently-set ultraviolet codec
   * @param url the url to encode
   */
  encodeUltraviolet(url: string) {
    return "/ult/ultraviolet/" + __uv$config.encodeUrl(url);
  }

  /**
   * encodes based on the currently-set scramjet codec
   * @param url the url to encode
   */
  encodeScramjet(url: string) {
    return "/scram/scramjet/" + __scramjet$config.codec.encode(url);
  }

  /**
   * encodes based on the currently-set meteor codec
   * @param url the url to encode
   */
  encodeMeteor(url: string) {
    return "/met/meteor/" + $meteor_config.codec.encode(url);
  }
}
