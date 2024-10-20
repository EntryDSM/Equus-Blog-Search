export function prettyFormat(data: any): string {
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
