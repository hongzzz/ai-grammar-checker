class Logger {
  private appName: string;

  constructor(appName: string) {
    this.appName = appName;
  }

  private formatMessage(level: string, color: string, ...args: any[]) {
    const style = `color: ${color}; font-weight: bold; background: #f0f0f0; padding: 2px 4px; border-radius: 3px;`;
    return [`%c[${this.appName}] ${level}:`, style, ...args];
  }

  log(...args: any[]) {
    console.log(...this.formatMessage('LOG', '#007acc', ...args));
  }

  error(...args: any[]) {
    console.error(...this.formatMessage('ERROR', '#d32f2f', ...args));
  }

  warn(...args: any[]) {
    console.warn(...this.formatMessage('WARN', '#f57c00', ...args));
  }

  info(...args: any[]) {
    console.info(...this.formatMessage('INFO', '#388e3c', ...args));
  }
}

export const logger = new Logger("AI Grammar Checker");
