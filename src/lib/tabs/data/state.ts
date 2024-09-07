import { BareClient } from "@mercuryworkshop/bare-mux";
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { useState } from "preact/hooks";
import type { BookmarkTreeNode } from "../extension/api/bookmarks";
import type { IdleState } from "../extension/api/idle";
import type { Keybind } from "../api/Keybind";
import type { Tab } from "_tabs/api/Tab";
import type { Protocol } from "_tabs/api/Protocol";

function __$bareClient() {
    const connection = new BareMuxConnection("/baremux/worker.js");
    return new BareClient();
}

export const [bare, setBare] = useState(__$bareClient());
export const [keybinds, setKeybinds] = useState<Keybind[]>([]);
export const [idleState, setIdleState] = useState<IdleState>("active");
export const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
export const [tabStack, setTabStack] = useState<Set<Tab>>(new Set());
export const [protocols, setProtocols] = useState<Protocol[]>([]);