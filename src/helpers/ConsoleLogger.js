import { log, error } from './consoleLoggerHelper';

class ConsoleLog {
    static log(...args) {
        log(...args);
    }

    static error(...args) {
        error(...args);
    }
}

export default ConsoleLog;

