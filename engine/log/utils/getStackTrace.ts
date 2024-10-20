export function getStackTrace(): string {
    const stack = new Error().stack || '';
    const stackLines = stack.split('\n');

    if (stackLines.length < 4) {
        return '알 수 없는 위치';
    }

    const callerInfo = stackLines[3].trim();
    return extractFileLocation(callerInfo);
}

function extractFileLocation(callerInfo: string): string {
    const start = callerInfo.indexOf('(');
    const end = callerInfo.indexOf(')');

    if (start === -1 || end === -1) {
        return '알 수 없는 위치';
    }

    const location = callerInfo.substring(start + 1, end);
    const parts = location.split(':');

    if (parts.length >= 2) {
        const [file, line] = parts;
        return `${file}:${line}`;
    }

    return '알 수 없는 위치';
}
