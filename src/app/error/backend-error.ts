export default class BackendError extends Error {
    constructor(message: string) {
        super(message);
    }
}