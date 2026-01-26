import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
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
    const errorCall = (console.error as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(errorCall[0]).toContain('RouteErrorBoundary caught error');
    expect(errorCall[0]).toHaveProperty('error');
    expect(errorCall[0]).toHaveProperty('stack');
    expect(errorCall[0]).toHaveProperty('componentStack');
    expect(errorCall[0]).toHaveProperty('timestamp');
    expect(errorCall[0]).toHaveProperty('boundaryType', 'route');
  });

  it('displays retry button that reloads page', () => {
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

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
    expect(reloadSpy).toHaveBeenCalled();

    reloadSpy.mockRestore();
  });

  it('displays go back button that navigates back', () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});

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
