import type { RuntimeModifier } from "_tabs/api/RuntimeModifier";
import type { Tab } from "_tabs/api/Tab";
import { patternToRegex } from "_tabs/util";

const modifiers: RuntimeModifier[] = [];

export function register(modifier: RuntimeModifier) { modifiers.push(modifier) }

export function registerTab(tab: Tab) {
    fireEvent("tabcreate", tab);

    tab.on("document_start", (url: string) => {
        modifiers.forEach(modifier => {
            modifier.getInjects().map(({ pattern, script }) => {
                if (patternToRegex(pattern).test(url)) {
                    if (tab.iframe.contentWindow) script(tab.iframe.contentWindow);
                }
            });
        });
    });
}

function fireEvent(event: string | symbol, ...args: any[]) {
    modifiers.forEach(modifier => {
        modifier.emit(event, ...args);
    });
}