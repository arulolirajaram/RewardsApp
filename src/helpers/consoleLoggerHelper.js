
const SHOW_CONSOLE = process.env.REACT_APP_CONSOLE_LOG;

/**
 * Logs a message to the console if console logging is enabled.
 * Handles different numbers of arguments: no args, message only, or message with data.
 * @param {string} [message] - The message to log.
 * @param {*} [data] - Additional data to log.
 * @returns {string} - Default message if no arguments provided.
 */
export function log(message, data) {
    if (!SHOW_CONSOLE) return;
    const currentTime = new Date();
    if (arguments.length === 0) {
        console.log('Case 1: No data provided. Returning default message.');
        return 'Please provide some data.';
    }
    if (arguments.length === 1) {
        console.log(`[Console Log ${currentTime.toLocaleTimeString()}] ${message}`);
    }
    if (arguments.length === 2) {
        console.log(`[Console Log ${currentTime.toLocaleTimeString()}] ${message}`, data);
    }
}

/**
 * Logs an error message to the console if console logging is enabled.
 * Handles different numbers of arguments: no args, message only, or message with data.
 * @param {string} [message] - The error message to log.
 * @param {*} [data] - Additional error data to log.
 * @returns {string} - Default message if no arguments provided.
 */
export function error(message, data) {
    if (!SHOW_CONSOLE) return;
    const currentTime = new Date();
    if (arguments.length === 0) {
        console.log('Case 1: No data provided. Returning default message.');
        return 'Please provide some data.';
    }
    if (arguments.length === 1) {
        console.error(`[Console Error ${currentTime.toLocaleTimeString()}] ${message}`);
    }
    if (arguments.length === 2) {
        console.error(`[Console Error ${currentTime.toLocaleTimeString()}] ${message}`, data);
    }
}
