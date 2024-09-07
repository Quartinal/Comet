// ! Credits to Velocity for this code!
export class ExtensionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ExtensionError";
    }
}