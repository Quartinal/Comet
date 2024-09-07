// ! Credits to Velocity for most of this code!
import { v4 as uuid } from "uuid";

const eventListeners = new Map<string, ((...args: any[]) => void)[]>();
const requests = new Map<
    string,
    [(data: any) => void, (data: any) => void]
>();
const handlers = new Map<string, Set<(data: any) => void>>();

function on(event: string, listener: (...args: any[]) => void) {
    const listeners = eventListeners.get("event") ?? [];

    listeners.push(listener);

    eventListeners.set(event, listeners);
}

function emit(event: string | string[], ...args: any[]) {
    if (Array.isArray(event)) {
        event.forEach(event => {
            emit(event, ...args);
        });

        return;
    }

    const listeners = eventListeners.get("event") ?? [];

    listeners.forEach(listener => {
        listener(...args);
    });

    self.postMessage({
        event,
        args
    });
}

function call<T>(action: string, data?: any): Promise<T> {
    const id = uuid();
    return new Promise((resolve, reject) => {
        requests.set(id, [resolve, reject]);

        self.postMessage({
            id,
            action,
            data,
            isRequest: true
        });
    });
}

function handle<T>(
    action: string,
    callback: (event: { data: T; reply: (data: any) => void }) => void
) {
    const openHandlers = handlers.get(action) ?? new Set();
    openHandlers.add(callback);
    handlers.set(action, openHandlers);
}

self.onmessage = ({ data }) => {
    if (data.event) {
        const listeners = eventListeners.get(data.event) ?? [];

        listeners.forEach(listener => {
            listener(...data.args);
        });
    } else if (data.action) {
        if (data.isResponse) {
            const request = requests.get(data.id);
            if (request) {
                if (data.success) request[0](data.data);
                else request[1](data.data);
            }
        } else if (data.isRequest) {
            const openHandlers = handlers.get(data.action) ?? new Set();
            openHandlers.forEach(handler => {
                handler({
                    data: data.data,
                    reply($data: any) {
                        self.postMessage({
                            id: data.id,
                            data: $data,
                            isResponse: true
                        });
                    }
                });
            });
        }
    }
};

export { on, emit, call, handle };