export function callbackMethodWrapper<
    T extends (...args: any[]) => Promise<any> | any
>(func: T): (...args: Parameters<T>) => ReturnType<T> {
    return (...args: Parameters<T>) => {
        const callbackMethodIndex = func.length, callback = args[callbackMethodIndex];

        const result = func(...(callback ? args.slice(0, -1) : args));

        if (callback) {
            if (result instanceof Promise) {
                result.then((...args: any[]) => {
                    callback(...args);
                });
            } else {
                callback(result);
            }
        }

        return result;
    }
}