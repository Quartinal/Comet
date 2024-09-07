import EventEmitter from "events";
import { register } from "_tabs/manager/workerAddonManager";

interface Inject {
    pattern: string;
    script: (x: Window) => void;
}

export class RuntimeModifier extends EventEmitter {
    name: string;
    #injects: Inject[] = [];

    constructor(name: string) {
        super();
        this.name = name;
        register(this);
    }

    createInject(pattern: Inject["pattern"], script: Inject["script"]) {
        this.#injects.push(
            pattern,
            script
        );
    }

    getInjects(): Inject[] {
        return this.#injects;
    }
}