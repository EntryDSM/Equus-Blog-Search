interface LoggerConfig {
    resetColor: string;
    maxLogs: number;
    detailedViewEnabled: boolean;
}

let loggerConfig: LoggerConfig = {
    resetColor: '\x1b[0m',
    maxLogs: 1000,
    detailedViewEnabled: false,
};

export function configureLogger(config: Partial<LoggerConfig>): void {
    loggerConfig = { ...loggerConfig, ...config };
    console.log('LOG 설정이 업데이트되었습니다:', loggerConfig);
}

export function getLoggerConfig(): LoggerConfig {
    return loggerConfig;
}
