import { logType } from './logTypes';

export const logTypeDetails = {
    [logType.Error]: { color: '\x1b[31m', label: 'ERROR' },
    [logType.Warn]: { color: '\x1b[33m', label: 'WARN' },
    [logType.Info]: { color: '\x1b[32m', label: 'INFO' },
    [logType.Debug]: { color: '\x1b[34m', label: 'DEBUG' }
};