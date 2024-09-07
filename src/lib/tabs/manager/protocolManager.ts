import { protocols } from "_tabs/data/state";

export const protocolManager = {
    find: (url: string) => {
        for (const protocol of protocols) {
            if (protocol.match.test(url)) {
                const domain = url.replace(protocol.match, "");
                return protocol.find(domain);
            }
        }
    },
    reverse: (url: string) => {
        for (const protocol of protocols) {
            if (protocol.reverse(url)) return protocol.reverse(url);
        }
    }
};