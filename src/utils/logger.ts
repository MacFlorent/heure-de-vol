const logPrefix = "[ HdV ]";
function prefixMessage(message: string = ""): string {
    return `${logPrefix} ${message}`;
}
 
export const logger = {
    debug: (message: string, context?: unknown) => {
        if (import.meta.env.DEV) {
            console.debug(prefixMessage(message), context);
        }
    },
    info: (message: string, context?: unknown) => {
        if (import.meta.env.DEV) {
            console.info(prefixMessage(message), context);
        }
    },
    warn: (message: string, context?: unknown) => {
        console.warn(prefixMessage(message), context);
    },
    error: (message: string, error?: Error) => {
        console.error(prefixMessage(message), error);
    }
};