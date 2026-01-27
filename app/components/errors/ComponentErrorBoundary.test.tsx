import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import React from 'react';
import {render, screen} from '@testing-library/react';

import {ComponentErrorBoundary} from './ComponentErrorBoundary';

// Component that throws an error
function ThrowError({shouldThrow = false}: {shouldThrow?: boolean}) {
  if (shouldThrow) {
    throw new Error('Component test error');
  }
  return <div>No error</div>;
}

// Suppress console.error during tests (we're testing error boundaries)
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

describe('ComponentErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ComponentErrorBoundary>
        <div>Test content</div>
      </ComponentErrorBoundary>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders custom fallback UI when error occurs', () => {
    const fallback = <div>Custom fallback UI</div>;

    render(
      <ComponentErrorBoundary fallback={fallback}>
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>,
    );

    expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
    expect(screen.queryByText('No error')).not.toBeInTheDocument();
  });

  it('renders nothing when error occurs and no fallback provided', () => {
    const {container} = render(
      <ComponentErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>,
    );

    // Should render null (graceful degradation)
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText('No error')).not.toBeInTheDocument();
  });

  it('logs error to console when error occurs', () => {
    render(
      <ComponentErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalled();
    const calls = (console.error as ReturnType<typeof vi.fn>).mock.calls;
    const errorCall = calls.find((args) => {
      // First arg is message string, second arg is details object
      const message = args[0];
      const details = args[1];
      return (
        typeof message === 'string' &&
        message.includes('ComponentErrorBoundary caught error') &&
        typeof details === 'object' &&
        details !== null &&
        'boundaryType' in details &&
        details.boundaryType === 'component'
      );
    });

    expect(errorCall).toBeDefined();
    const details = errorCall![1];
    expect(details).toHaveProperty('error');
    expect(details).toHaveProperty('stack');
    expect(details).toHaveProperty('componentStack');
    expect(details).toHaveProperty('timestamp');
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <ComponentErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
  });

  it('does not call onError when no error occurs', () => {
    const onError = vi.fn();

    render(
      <ComponentErrorBoundary onError={onError}>
        <div>No error</div>
      </ComponentErrorBoundary>,
    );

    expect(onError).not.toHaveBeenCalled();
  });

  it('enables graceful degradation (commerce continues when component fails)', () => {
    // Simulate commerce flow with failing component
    render(
      <div>
        <div>Commerce content that should still work</div>
        <ComponentErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ComponentErrorBoundary>
        <div>More commerce content</div>
      </div>,
    );

    // Commerce content should still be visible
    expect(
      screen.getByText('Commerce content that should still work'),
    ).toBeInTheDocument();
    expect(screen.getByText('More commerce content')).toBeInTheDocument();
    // Failed component should be gracefully handled (renders null)
    expect(screen.queryByText('No error')).not.toBeInTheDocument();
  });

  it('does not expose technical error details in fallback', () => {
    const fallback = <div>Fallback UI</div>;

    render(
      <ComponentErrorBoundary fallback={fallback}>
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>,
    );

    // Should not show error message, stack, or technical details
    expect(screen.queryByText('Component test error')).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/at /i)).not.toBeInTheDocument();
  });
});
