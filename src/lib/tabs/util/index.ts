import type { Tab } from "_tabs/api/Tab";
import { tabStack } from "_tabs/data/state";
import type { Preferences } from "_tabs/types/Preferences";
import { storage } from "~/lib/localStorage";

export function preferences() {
    return (storage.get("preferences") as string)
        ? JSON.parse(storage.get("preferences") as string)
        : ({
            "general.startup.openPreviousTabs": true,
            "general.tabs.openWindowLinksInTab": true,
            "general.tabs.switchToMedia": false,
            "general.tabs.confirmBeforeClosing": true,
            "search.defaults.useHttps": true,
            "search.defaults.searchEngine": "google",
            "search.defaults.proxy": "ultraviolet",
            "bookmarks.shown": true
        } as const);
}

export const xor = new (class XOR {
    encode(url: string) {
        if (!url) return url;
        return encodeURIComponent(
            url
                .toString()
                .split("")
                .map((character, index) => 
                    index % 2 
                        ? String.fromCharCode(character.charCodeAt(0) ^ 2) 
                        : character
                )
                .join("")
        );
    }

    decode(url: string) {
        if (!url) return url;
        let [input, ...search] = url.split("?");

        return (
            decodeURIComponent(input)
                .split("")
                .map((character, index) => 
                    index % 2 
                        ? String.fromCharCode(character.charCodeAt(0) ^ 2)
                        : character
                )
                .join("") + (search.length ? "?" + search.join("") : "")
        );
    }
})();

export const engines = {
    google: {
        name: "Google",
        url: "https://www.google.com/search?q=%s"
    },
    bing: {
        name: "Bing",
        url: "https://www.bing.com/search?q=%s"
    },
    duckduckgo: {
        name: "DuckDuckGo",
        url: "https://duckduckgo.com/?q=%s"
    },
    brave: {
        name: "Brave",
        url: "https://search.brave.com/search?q=%s"
    },
    yahoo: {
        name: "Yahoo",
        url: "https://search.yahoo.com/search?p=%s"
    }
};

export function patternToRegex(pattern: string) {
    if (pattern == "<all_urls>") return /^(?:http|https|file|ftp):\/\/.*/;

    var split = /^(\*|http|https|file|ftp):\/\/(.*)$/.exec(pattern);
    if (!split) return /$./;
    var schema = split[1], fullpath = split[2];

    var split = /^([^\/]*)\/(.*)$/.exec(fullpath);
    if (!split) return /$./;
    var host = split[1], path = split[2];

    if (schema == "file" && host != "") return /$./;
    if (schema != "file" && host == "") return /$./;
    if (!/^(\*|\*\.[^*]+|[^*]*)$/.exec(host)) return /$./;

    var restring = "^";
    restring += schema == "*" ? "https*" : schema;
    restring += ":\\/\\/";
    restring += host.replace(/\*\.?/, "[^\\/]*");
    restring += "(:\\d+)?";
    restring += "\\/";
    restring += path.replace("*", ".*");
    restring += "$";

    return RegExp(restring);
}

export const ADDON_NORMALIZE_REGEX = /^\.?\//;

export function getActiveTab(): Tab {
  return Array.from(tabStack)[0];
}