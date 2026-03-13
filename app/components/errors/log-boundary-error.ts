import type {ErrorInfo} from 'react';

/**
 * Shared structured error logging for error boundaries.
 * Preserves the existing log format so tests continue to pass.
 */
export function logBoundaryError(
  boundaryName: string,
  boundaryType: string,
  error: Error,
  errorInfo: ErrorInfo,
): void {
  console.error(`${boundaryName} caught error:`, {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
    boundaryType,
  });
}
