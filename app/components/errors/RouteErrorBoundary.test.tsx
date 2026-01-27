import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';

import {RouteErrorBoundary} from './RouteErrorBoundary';

// Component that throws an error
function ThrowError({shouldThrow = false}: {shouldThrow?: boolean}) {
  if (shouldThrow) {
    throw new Error('Test error');
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

describe('RouteErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <RouteErrorBoundary>
        <div>Test content</div>
      </RouteErrorBoundary>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('catches errors and displays fallback UI', () => {
    render(
      <RouteErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RouteErrorBoundary>,
    );

    // Should display error message
    expect(
      screen.getByText(/Something's not quite right/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Your cart is safe/i)).toBeInTheDocument();
  });

  it('logs error to console when error occurs', () => {
    render(
      <RouteErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RouteErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalled();
    const calls = (console.error as ReturnType<typeof vi.fn>).mock.calls;
    const errorCall = calls.find((args) => {
      // First arg is message string, second arg is details object
      const message = args[0];
      const details = args[1];
      return (
        typeof message === 'string' &&
        message.includes('RouteErrorBoundary caught error') &&
        typeof details === 'object' &&
        details !== null &&
        'boundaryType' in details &&
        details.boundaryType === 'route'
      );
    });

    expect(errorCall).toBeDefined();
    const details = errorCall![1];
    expect(details).toHaveProperty('error');
    expect(details).toHaveProperty('stack');
    expect(details).toHaveProperty('componentStack');
    expect(details).toHaveProperty('timestamp');
  });

  it('displays retry button that reloads page', () => {
    const originalLocation = window.location;
    // @ts-expect-error - Mocking window.location for test
    delete window.location;
    (window.location as any) = {...originalLocation, reload: vi.fn()};

    render(
      <RouteErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RouteErrorBoundary>,
    );

    const retryButton = screen.getByRole('button', {
      name: /reload page and try again/i,
    });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(window.location.reload).toHaveBeenCalled();

    (window.location as any) = originalLocation;
  });

  it('displays go back button that navigates back', () => {
    const backSpy = vi
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});

    render(
      <RouteErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RouteErrorBoundary>,
    );

    const goBackButton = screen.getByRole('button', {
      name: /navigate back to previous page/i,
    });
    expect(goBackButton).toBeInTheDocument();

    fireEvent.click(goBackButton);
    expect(backSpy).toHaveBeenCalled();

    backSpy.mockRestore();
  });

  it('has accessible error UI with proper ARIA attributes', () => {
    render(
      <RouteErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RouteErrorBoundary>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('does not expose technical error details to users', () => {
    render(
      <RouteErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RouteErrorBoundary>,
    );

    // Should not show error message, stack, or technical details
    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/at /i)).not.toBeInTheDocument();
  });
});
