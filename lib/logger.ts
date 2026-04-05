import "server-only";
import pino from "pino";

/**
 * Logger server memakai Pino: JSON di production (Vercel / log drain), pino-pretty di development.
 *
 * Env: LOG_LEVEL (trace|debug|info|warn|error|fatal|silent), default dev=debug, production=info.
 */

export type LogMeta = Record<string, unknown>;

export type Logger = {
  debug: (msg: string, meta?: LogMeta) => void;
  info: (msg: string, meta?: LogMeta) => void;
  warn: (msg: string, meta?: LogMeta) => void;
  error: (msg: string, meta?: LogMeta) => void;
  err: (msg: string, error: unknown, meta?: LogMeta) => void;
  child: (scope: string) => Logger;
};

const isProd = process.env.NODE_ENV === "production";

const level =
  process.env.LOG_LEVEL ??
  (isProd ? "info" : "debug");

const baseOptions: pino.LoggerOptions = {
  level,
  ...(process.env.VERCEL ? { base: { runtime: "vercel" } } : {}),
  serializers: {
    err: pino.stdSerializers.err,
  },
};

const root: pino.Logger = isProd
  ? pino(baseOptions)
  : pino({
      ...baseOptions,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
    });

function emit(
  log: pino.Logger,
  fn: pino.LogFn,
  msg: string,
  meta?: LogMeta,
): void {
  if (meta && Object.keys(meta).length > 0) {
    fn.call(log, meta, msg);
  } else {
    fn.call(log, msg);
  }
}

function unknownErrorFields(error: unknown): LogMeta {
  if (error instanceof Error) {
    return { err: error };
  }
  if (error && typeof error === "object") {
    const o = error as Record<string, unknown>;
    const code = o.code;
    const message = o.message;
    return {
      errType: o.constructor?.name ?? "object",
      ...(typeof code !== "undefined" ? { code } : {}),
      ...(typeof message !== "undefined" ? { errMessage: String(message) } : {}),
    };
  }
  return { errDetail: String(error) };
}

function makeLogger(log: pino.Logger, scopeLabel?: string): Logger {
  return {
    debug: (msg, meta) => emit(log, log.debug, msg, meta),
    info: (msg, meta) => emit(log, log.info, msg, meta),
    warn: (msg, meta) => emit(log, log.warn, msg, meta),
    error: (msg, meta) => emit(log, log.error, msg, meta),
    err: (msg, error, meta) => {
      if (error instanceof Error) {
        log.error({ err: error, ...meta }, msg);
      } else {
        log.error({ ...unknownErrorFields(error), ...meta }, msg);
      }
    },
    child: (s: string) => {
      const nextScope = scopeLabel ? `${scopeLabel}:${s}` : s;
      return makeLogger(root.child({ scope: nextScope }), nextScope);
    },
  };
}

export function createLogger(scope?: string): Logger {
  if (!scope) return makeLogger(root);
  return makeLogger(root.child({ scope }), scope);
}

export const logger = createLogger();
