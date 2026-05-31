export class PinoLogger {
  info(message: string | object, ...args: any[]) {
    console.log('[INFO]', message, ...args);
  }

  error(message: string | object, ...args: any[]) {
    console.error('[ERROR]', message, ...args);
  }

  debug(message: string | object, ...args: any[]) {
    console.log('[DEBUG]', message, ...args);
  }

  warn(message: string | object, ...args: any[]) {
    console.warn('[WARN]', message, ...args);
  }
}
