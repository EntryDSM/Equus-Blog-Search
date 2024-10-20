type EventHandler = (eventData?: any) => void;
let eventHandlers: Record<string, EventHandler[]> = {};

export function emit(event: string, eventData?: any): void {
    if (eventHandlers[event]) {
        eventHandlers[event].forEach(handler => handler(eventData));
    }
}

export function on(event: string, handler: EventHandler): void {
    if (!eventHandlers[event]) {
        eventHandlers[event] = [];
    }
    eventHandlers[event].push(handler);
}
