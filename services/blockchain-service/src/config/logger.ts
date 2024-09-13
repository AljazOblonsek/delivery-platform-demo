import { trace } from '@opentelemetry/api';
import { Logger, pino } from 'pino';
import { env } from './env';

const createLogger = (): Logger => {
  const pinoLogger = pino({
    level: env.LOG_LEVEL,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        messageFormat: `{msg}`,
      },
    },
  });

  return {
    ...pinoLogger,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: <T extends object>(obj: T, msg?: string, ...args: any[]): void => {
      const activeSpan = trace.getActiveSpan();

      if (activeSpan) {
        activeSpan.addEvent('log', {
          LogLevel: 'info',
          obj: JSON.stringify(obj),
          msg,
        });
      }

      pinoLogger.info(obj, msg, args);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: <T extends object>(obj: T, msg?: string, ...args: any[]): void => {
      const activeSpan = trace.getActiveSpan();

      if (activeSpan) {
        activeSpan.addEvent('log', {
          LogLevel: 'warn',
          obj: JSON.stringify(obj),
          msg,
        });
      }

      pinoLogger.warn(obj, msg, args);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: <T extends object>(obj: T, msg?: string, ...args: any[]): void => {
      const activeSpan = trace.getActiveSpan();

      if (activeSpan) {
        activeSpan.addEvent('log', {
          LogLevel: 'error',
          obj: JSON.stringify(obj),
          msg,
        });
      }

      pinoLogger.error(obj, msg, args);
    },
  };
};

export const logger = createLogger();
