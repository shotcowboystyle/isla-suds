/**
 * Deterministic Wait Helpers
 *
 * Provides polling helpers for complex async conditions.
 * Replaces hard waits with explicit condition-based waiting.
 */

/**
 * Poll for a condition to become true within a timeout
 *
 * @example
 * await waitFor(
 *   async () => {
 *     const response = await fetch('/api/status');
 *     const data = await response.json();
 *     return data.ready === true;
 *   },
 *   { timeout: 5000, interval: 100 }
 * );
 */
export async function waitFor(
  condition: () => Promise<boolean> | boolean,
  options: {
    timeout?: number;
    interval?: number;
    errorMessage?: string;
  } = {},
): Promise<void> {
  const {
    timeout = 5000,
    interval = 100,
    errorMessage = 'Condition not met within timeout',
  } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = await condition();
      if (result) {
        return;
      }
    } catch (error) {
      // Condition threw error, continue polling
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`${errorMessage} (timeout: ${timeout}ms)`);
}

/**
 * Wait for a value to equal an expected value
 *
 * @example
 * await waitForValue(
 *   () => page.locator('[data-testid="status"]').textContent(),
 *   'completed',
 *   { timeout: 3000 }
 * );
 */
export async function waitForValue<T>(
  getValue: () => Promise<T> | T,
  expectedValue: T,
  options: {
    timeout?: number;
    interval?: number;
  } = {},
): Promise<void> {
  await waitFor(
    async () => {
      const value = await getValue();
      return value === expectedValue;
    },
    {
      ...options,
      errorMessage: `Expected value ${expectedValue} not reached`,
    },
  );
}

/**
 * Retry an operation with exponential backoff
 *
 * @example
 * const data = await retry(
 *   async () => {
 *     const response = await fetch('/api/data');
 *     if (!response.ok) throw new Error('Failed');
 *     return response.json();
 *   },
 *   { maxAttempts: 3 }
 * );
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    backoffMs?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {},
): Promise<T> {
  const {maxAttempts = 3, backoffMs = 1000, onRetry} = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts) {
        onRetry?.(attempt, lastError);
        await new Promise((resolve) =>
          setTimeout(resolve, backoffMs * attempt),
        );
      }
    }
  }

  throw new Error(
    `Operation failed after ${maxAttempts} attempts: ${lastError!.message}`,
  );
}
