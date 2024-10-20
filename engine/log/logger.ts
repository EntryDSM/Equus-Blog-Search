import { logType } from './types/logTypes';
import { logTypeDetails } from './types/logTypesDetails';
import { getStackTrace } from './utils/getStackTrace';
import { prettyFormat } from './utils/prettyFormat';
import { configureLogger, getLoggerConfig } from './configs/loggerConfig';

interface LogEntry {
    summary: string;
    details: string;
}

const DEFAULT_LOG_TYPE = logType.Info; 
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

function getLogDetails(level: logType, message: string, location: string): LogEntry {
    const logDetail = logTypeDetails[level] || logTypeDetails[DEFAULT_LOG_TYPE];
    const { color, label } = logDetail;
    const timestamp = new Date().toISOString();
    const config = getLoggerConfig();
    
    const logMessage = formatLogMessage(color, label, message, timestamp, location, config.resetColor);

    return { summary: logMessage, details: logMessage };
}

function formatLogMessage(
    color: string, 
    label: string, 
    message: string, 
    timestamp: string, 
    location: string, 
    resetColor: string
): string {
    return `[${timestamp}] ${color}[${label}]${resetColor}: ${message} (${location})`;
}

function processLog(level: logType, message: string, ...args: any[]): void {
    const config = getLoggerConfig();
    const location = getStackTrace();
    const { summary, details } = getLogDetails(level, message, location);

    console.log(summary);

    if (config.detailedViewEnabled) {
        const detailedLog = formatDetailedLog(details, args);
        console.log(detailedLog);
        addLogToMemory({ summary, details: detailedLog }, config.maxLogs);
    } else {
        addLogToMemory({ summary, details }, config.maxLogs);
    }
}

function formatDetailedLog(details: string, args: any[]): string {
    const formattedArgs = args.map(prettyFormat).join('\n');
    return `${details}\n${formattedArgs}`;
}

export function enableDetailedView(isEnabled: boolean): void {
    configureLogger({ detailedViewEnabled: isEnabled });
    const modeStatus = isEnabled ? 'enabled' : 'disabled';
    logger.info(`자세히 보기 ${modeStatus}`);
}

const logger = {
    error: (message: string, ...args: any[]) => processLog(logType.Error, message, ...args),
    warn: (message: string, ...args: any[]) => processLog(logType.Warn, message, ...args),
    info: (message: string, ...args: any[]) => processLog(logType.Info, message, ...args),
    debug: (message: string, ...args: any[]) => processLog(logType.Debug, message, ...args),
    enableDetailedView,
    configure: configureLogger,
};

export default logger;
