import { useState } from "preact/hooks";
import type { ContextItem } from "_tabs/api/ContextItem";

const [clientX, setClientX] = useState(0), [clientY, setClientY] = useState(0);
const [x, setX] = useState(0), [y, setY] = useState(0);
const [visible, setVisible] = useState<number | boolean>(0);
const [buttons, setButtons] = useState<ContextItem[]>([]);

export function bindIFrameMousemove(scope: HTMLIFrameElement | Window) {
    const scopeWindow = 
        scope instanceof HTMLIFrameElement 
            ? (scope.contentWindow) 
            : scope;

    if (!scopeWindow) return;

    scopeWindow.addEventListener("visibilitychange", () => {
        setVisible(false);
    });

    scopeWindow.onmousemove = event => {
        let offsetX = 0, offsetY = 0;

        if (scope instanceof HTMLIFrameElement) {
            const clRect = scope.getBoundingClientRect();
            offsetX = clRect.left; 
            offsetY = clRect.top;
        }

        setClientX(event.clientX + offsetX);
        setClientY(event.clientY + offsetY);
    };

    scopeWindow.oncontextmenu = (event: MouseEvent & { data: ContextItem[] }) => {
        event.preventDefault();
        if (event.data) {
            setVisible(true);
            setButtons(event.data);
            let width =
                document.querySelector<HTMLDivElement>("#context-menu")?.offsetWidth;
            let height =
                document.querySelector<HTMLDivElement>("#context-menu")?.offsetHeight;
            let x = clientX, y = clientY;
            if (width && x > window.innerWidth - width) x -= width;
            if (height && y > window.innerHeight - height) x -= height;
            setX(x);
            setY(y);
        } else setVisible(false);
    };

    scopeWindow.onclick = () => setVisible(false);
    scopeWindow.onkeydown = event => setVisible(false);
}