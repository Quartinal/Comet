import { open } from "./clickManager";
import { ContextItem } from "_tabs/api/ContextItem";
import { Tab } from "_tabs/api/Tab";
import { getActiveTab } from "_tabs/util";

export function generateContextButtons(element: HTMLElement): ContextItem[] {
    const buttons: ContextItem[] = [];

    if (isElementOfType(element, "a"))
        buttons.push(
            new ContextItem({
                text: "Open link in new tab",
                onClick: () => {
                    open(
                        undefined, 
                        getElementAttribute(element, "href"), 
                        true, 
                        false
                    );
                }
            }),
            new ContextItem({
                text: "Copy link address",
                onClick: () => {
                    navigator.clipboard.writeText(
                        getElementAttribute(element, "href")
                    );
                }
            })
        );

    if (isElementOfType(element, "img"))
        buttons.push(
            new ContextItem({
                text: "Open image in new tab",
                onClick: () => {
                    open(undefined, getElementAttribute(element, "src"), true, false);
                }
            }),
            new ContextItem({
                text: "Copy image address",
                onClick: () => {
                    navigator.clipboard.writeText(getElementAttribute(element, "src"));
                }
            }),
            new ContextItem({ separator: true })
        );

    
}

function isElementOfType(element: HTMLElement, type: string) {
    if (element.tagName.toLowerCase() === type) return true;
    else if (element.parentElement) return isElementOfType(element.parentElement, type);
    else return false;
}

function getElementAttribute(element: any, attribute: string) {
    if (element[attribute]) return element[attribute];
    else if (element.parentElement) 
        return getElementAttribute(element.parentElement, attribute);
    else return "";
}