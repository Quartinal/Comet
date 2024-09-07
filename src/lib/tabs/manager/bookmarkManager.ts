import { globalBindUtil } from "./workerAddonManager";
import {
    remove,
    create,
    update
} from "_tabs/extension/api/bookmarks";
import type {
    BookmarkTreeNode,
    CreateDetails
} from "_tabs/extension/api/bookmarks";
import { Tab } from "_tabs/api/Tab";
import { bookmarks, setBookmarks } from "_tabs/data/state";
import { getActiveTab } from "_tabs/util";

export async function createNode(bookmark: CreateDetails) {
    const node = await create(bookmark);

    setBookmarks([...bookmarks, node]);

    globalBindUtil.emit("bookmarks.create", node.id, node);
}

export async function removeNode(node: BookmarkTreeNode) {
    await remove(node.id);

    setBookmarks(bookmarks.filter(x => x.id !== node.id));

    globalBindUtil.emit("bookmarks.onRemoved", node.id, {
        index: node.index,
        node,
        parentId: node.parentId
    });
}

export async function run(
    node: BookmarkTreeNode, 
    event?: MouseEvent, 
    ctrlOverride?: boolean
) {
    if (node.url !== undefined) {
        if (/^javascript:/.test(node.url)) 
            getActiveTab().executeScript(
                decodeURIComponent(node.url.replace(/^javascript:/, ""))  
            );
        else {
            if (event?.ctrlKey || ctrlOverride) 
                new Tab(node.url || "about:newtab", false);
            else getActiveTab().navigate(node.url || "about:newtab");
        }
    }
}

export async function edit(node: BookmarkTreeNode) {
    const popup = new CometTabs.popup(CometTabs.getActiveTab());

    popup.addComponent({
        type: "text",
        content: "Name"
    });
    popup.addComponent({
        type: "input",
        id: "title",
        value: node.title
    });

    popup.addComponent({
        type: "text",
        content: "URL"
    });
        popup.addComponent({
        type: "input",
        id: "url",
        value: node.url
    });

    popup.addButton({
        style: 0,
        text: "Save",
        id: "save"
    });
    popup.addButton({
        style: 1,
        text: "Cancel",
        id: "cancel"
    });

    popup.on("save", data => {
        update(node.id, {
            title: node.title,
            url: data.url
        });

        setBookmarks([
            ...bookmarks.filter(x => x.id !== node.id),
            Object.assign({}, node, {
                title: data.title, 
                url: data.url
            })
        ]);
    });

    popup.push();
}