import {
    xor,
    engines,
    preferences
} from ".";
import { protocolManager } from "_tabs/manager/protocolManager";

declare global {
    var reload: typeof Window.prototype.location.reload;
}

export function normalize(url: string) {
    if (!("location" in globalThis)) return url;
    const reverse = protocolManager.reverse(url);
    if (protocolManager.find(url)) return url;
    if (reverse) url = reverse;
    else if (url.startsWith(origin + __uv$config.prefix)) {
        url = url.replace(origin + __uv$config.prefix, "");
        url = xor.decode(url);
    }
    else if (url.startsWith(origin + __scramjet$config.prefix)) {
        url = url.replace(origin + __scramjet$config.prefix, "");
        url = xor.decode(url);
    }
    else if (url.startsWith(origin + $meteor_config.prefix)) {
        url = url.replace(origin + $meteor_config.prefix, "");
        url = xor.decode(url);
    }
    if (url === "about:newtab") url = "";

    return url;
}

export function generateProxyURL(query: string) {
    let location: string;
    if (!__uv$config) reload();
    if (protocolManager.find(query) || protocolManager.reverse(query))
        location = protocolManager.find(query) || "/internal/newTab";
    else if (/^https?:\/\/([^\s]+\.)+[^\s]+(:[0-65536])?$/.test(query))
        location = origin + __uv$config.prefix + __uv$config.encodeUrl(query);
    else if (/^([^\s]+\.)+[^\s]+(:[0-65536])?$/.test(query))
        location = 
            origin + 
            __uv$config.prefix + 
            __uv$config.encodeUrl(
                "http" +
                    (preferences()["search.defaults.useHttps"] ? "s" : "") +
                    "://" +
                    query
            );
    else 
        location = 
            origin +
            __uv$config.prefix +
            __uv$config.encodeUrl(generateSearchURL(query));
    return location;
}

function generateSearchURL(query: string): string {
    return engines[
        preferences()["search.defaults.searchEngine"] || "google"
    ].name.replace("%s", encodeURIComponent(query));
}

export function areEqual(a: string, b: string) {
    try {
        const urlA = new URL(a), urlB = new URL(b);
        return (
            urlA.origin === urlB.origin &&
            urlA.pathname === urlB.pathname &&
            urlA.search === urlB.search
        );
    } catch { return false }
}