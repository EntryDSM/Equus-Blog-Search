const logLevels = {
    error: { color: '\x1b[31m', label: 'ERROR' },
    warn: { color: '\x1b[33m', label: 'WARN' },
    info: { color: '\x1b[32m', label: 'INFO' },
    debug: { color: '\x1b[34m', label: 'DEBUG' }
};

const RESET_COLOR = '\x1b[0m';
const MAX_LOGS = 1000;
let logMemory: { summary: string, details: string }[] = [];
let detailedViewEnabled = false;

function getStackTrace() {
    const stack = new Error().stack || '';
    const stackLines = stack.split('\n');

    if (stackLines.length < 4) {
        return 'unknown location';
    }

    const callerInfo = stackLines[3].trim();
    return extractFileLocation(callerInfo);
}

function extractFileLocation(callerInfo: string) {
    const start = callerInfo.indexOf('(');
    const end = callerInfo.indexOf(')');

    if (start !== -1 && end !== -1) {
        const location = callerInfo.substring(start + 1, end);
        const parts = location.split(':');

        if (parts.length >= 2) {
            const file = parts[0];
            const line = parts[1];
            return `${file}:${line}`;
        }
    }
    return 'unknown location';
}

function prettyFormat(data: any) {
    const cache = new Set();
    const result = JSON.stringify(data, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) return '[Circular]';
            cache.add(value);
        }
        return value;
    }, 2);
    cache.clear();
    return result;
}

function formatLog(level: string, message: string, location: string) {
    const { color, label } = logLevels[level] || logLevels.info;
    const timestamp = new Date().toISOString();
    return {
        summary: `[${timestamp}] ${color}[${label}]${RESET_COLOR}: ${message} (${location})`,
        details: `[${timestamp}] ${color}[${label}]${RESET_COLOR}: ${message} (${location})`
    };
}

function log(level: string, message: string, ...args: any[]) {
    const location = getStackTrace();
    const { summary, details } = formatLog(level, message, location);

    console.log(summary);

    if (detailedViewEnabled) {
        console.log(`${details}\n${args.map(prettyFormat).join('\n')}`);
    }

    if (logMemory.length >= MAX_LOGS) logMemory.shift();
    logMemory.push({ summary, details: `${details}\n${args.map(prettyFormat).join('\n')}` });
}

function enableDetailedView(enabled: boolean) {
    detailedViewEnabled = enabled;
    console.log(`Detailed view mode is now ${enabled ? 'enabled' : 'disabled'}.`);
}

const logger = {
    error: (message: string, ...args: any[]) => log('error', message, ...args),
    warn: (message: string, ...args: any[]) => log('warn', message, ...args),
    info: (message: string, ...args: any[]) => log('info', message, ...args),
    debug: (message: string, ...args: any[]) => log('debug', message, ...args),
    enableDetailedView
};

export default logger;
