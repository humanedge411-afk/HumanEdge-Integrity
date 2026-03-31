// AuditLog.ts

/**
 * AuditLog class for tracking compliance events.
 */
class AuditLog {
    private logs: string[];

    constructor() {
        this.logs = [];
    }

    /**
     * Log an event.
     * @param event - The event to log.
     */
    logEvent(event: string): void {
        const timestamp = new Date().toISOString();
        this.logs.push(`${timestamp}: ${event}`);
        console.log(`Logged: ${timestamp}: ${event}`);
    }

    /**
     * Retrieve all logs.
     * @returns Array of log strings.
     */
    getLogs(): string[] {
        return this.logs;
    }
}

export default AuditLog;