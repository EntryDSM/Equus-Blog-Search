import { logType } from './types/logTypes';
import { logTypeDetails } from './types/logTypesDetails';
import { getStackTrace } from './utils/getStackTrace';
import { prettyFormat } from './utils/prettyFormat';
import { configureLogger, getLoggerConfig } from './configs/loggerConfig';

interface LogEntry {
    summary: string;
    details: string;
}

let logMemory: LogEntry[] = [];
let logIndex = 0;

function addLogToMemory(log: LogEntry, maxLogs: number): void {
    if (logMemory.length < maxLogs) {
        logMemory.push(log);
    } else {
        logMemory[logIndex] = log;
    }
    logIndex = (logIndex + 1) % maxLogs;
}

function formatLog(level: logType, message: string, location: string): LogEntry {
    const logDetail = logTypeDetails[level] || logTypeDetails[logType.Info];
    const { color, label } = logDetail;
    const timestamp = new Date().toISOString();
    const config = getLoggerConfig();
    const logMessage = `[${timestamp}] ${color}[${label}]${config.resetColor}: ${message} (${location})`;

    return {
        summary: logMessage,
        details: logMessage,
    };
}

function log(level: logType, message: string, ...args: any[]): void {
    const config = getLoggerConfig();
    let location = getStackTrace();

    const { summary, details } = formatLog(level, message, location);

    console.log(summary);

    if (config.detailedViewEnabled) {
        const formattedArgs = args.map(prettyFormat).join('\n');
        console.log(`${details}\n${formattedArgs}`);
        addLogToMemory({ summary, details: `${details}\n${formattedArgs}` }, config.maxLogs);
    } else {
        addLogToMemory({ summary, details }, config.maxLogs);
    }
}


export function enableDetailedView(enabled: boolean): void {
    configureLogger({ detailedViewEnabled: enabled });
    console.log(`상세 보기 모드가 이제 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
}

const logger = {
    error: (message: string, ...args: any[]) => log(logType.Error, message, ...args),
    warn: (message: string, ...args: any[]) => log(logType.Warn, message, ...args),
    info: (message: string, ...args: any[]) => log(logType.Info, message, ...args),
    debug: (message: string, ...args: any[]) => log(logType.Debug, message, ...args),
    enableDetailedView,
    configure: configureLogger,
};

export default logger;
