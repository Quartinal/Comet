import EventEmitter from "events";
import { useState } from "preact/hooks";
import { setTabStack, tabStack, setTabs, tabs } from "_tabs/data/state";
import { createNode } from "_tabs/manager/bookmarkManager";
import * as contentScriptManager from "_tabs/manager/contentScriptManager";
import * as tabManager from "_tabs/manager/tabManager";
import { getActiveTab } from "_tabs/util";