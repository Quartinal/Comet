import * as EventManager from "../../types/EventManager";
import * as bindUtil from "../util/bindingUtil";
import { callbackMethodWrapper } from "../util/callbackMethodWrapper";

export type IdleState = "active" | "idle" | "locked";
type StateUpdate = {
    time: number;
    state: IdleState;
};

const idleUpdates: StateUpdate[] = [{
    time: Date.now(),
    state: "active"
}];

export const getAutoLockDelay = callbackMethodWrapper(__$getAutoLockDelay);

function __$getAutoLockDelay() { return 0 }

export const queryState = callbackMethodWrapper(__$queryState);

async function __$queryState(detectIntervalInSeconds: number): Promise<IdleState> {
    const time = Date.now() - detectIntervalInSeconds * 1000;
    let state = idleUpdates[0];

    idleUpdates.forEach(update => {
        if (time <= update.time) state = update;
    });

    return state.state;
}

export function setDetectionInterval(intervalInSeconds: number) {
    bindUtil.emit("idle.setDetectionInterval", intervalInSeconds);
}

export const onStateChanged = new EventManager.Event("idle.onStateChanged");

bindUtil.on("idle.onStateChanged", data => {
    idleUpdates.unshift({
        time: Date.now(),
        state: data
    });

    if (idleUpdates.length > 1000) idleUpdates.length = 1000;
});