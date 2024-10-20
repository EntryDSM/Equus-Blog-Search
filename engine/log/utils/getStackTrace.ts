export function getStackTrace(): string {
    const stack = new Error().stack || '';
    const stackLines = stack.split('\n');
    
    for (let i = 3; i < stackLines.length; i++) {
        const callerInfo = stackLines[i].trim();
        
        if (!callerInfo.includes('processLog') && 
            !callerInfo.includes('logger')) {
            return extractFileLocation(callerInfo);
        }
    }
    
    return '알 수 없는 위치';
}

function extractFileLocation(callerInfo: string): string {
    const start = callerInfo.indexOf('(');
    const end = callerInfo.indexOf(')');

    if (start === -1 || end === -1) {
        return '알 수 없는 위치';
    }

    const location = callerInfo.substring(start + 1, end);
    const parts = location.split(':');

    if (parts.length >= 3) {
        const filePath = parts.slice(0, -2).join(':');
        const lineNumber = parts[parts.length - 2]; 
        const columnNumber = parts[parts.length - 1];
        return `${filePath}:${lineNumber}:${columnNumber}`;
    }

    return '알 수 없는 위치';
}
