// ! Credits to Velocity for most of this code!
import * as bindUtil from "_tabs/extension/util/bindingUtil";

type Listener = (...args: any) => void;

export class Event {
    #listeners: Listener[] = [];

    constructor(event: string) {
        bindUtil.on(event, (...data: any[]) => {
            this.#dispatch(data);
        });
    }

    addListener(listener: Listener) {
        this.#listeners.push(listener);
    }

    removeListener(listener: Listener) {
        this.#listeners = this.#listeners.filter(x => x !== listener);
    }

    hasListener(listener: Listener) {
        return this.#listeners.includes(listener);
    }

    #dispatch(...args: any[]) {
        this.#listeners.forEach(listener => {
            listener(...args);
        });
    }
}