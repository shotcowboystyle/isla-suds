import {useEffect, useRef, useState} from 'react';
import {ROUTE_ERROR_MESSAGE} from '~/content/errors';
import {cn} from '~/utils/cn';

interface RouteErrorFallbackProps {
  /** Whether to show full page layout (for React Router ErrorBoundary) */
  fullPage?: boolean;
}

/**
 * Reusable route error fallback UI component.
 * Displays warm, non-accusatory error message with retry and go back options.
 *
 * Features:
 * - Focus trap (keyboard users can't tab out of error UI)
 * - Focus returns to first focusable element on mount
 * - Accessible (keyboard nav, screen reader friendly)
 * - Respects prefers-reduced-motion
 * - Warm error message (no technical details)
 */
export function RouteErrorFallback({fullPage = false}: RouteErrorFallbackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const retryButtonRef = useRef<HTMLButtonElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check if user prefers reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      );
    }
  }, []);

  // Focus trap: Trap focus within error UI
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Focus first focusable element (retry button)
    retryButtonRef.current?.focus();

    // Get all focusable elements within container
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Trap Tab key
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: If on first element, move to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: If on last element, move to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const errorContent = (
    <div
      ref={containerRef}
      className={cn(
        'min-h-screen flex items-center justify-center',
        'bg-[--canvas-base] px-4',
        !prefersReducedMotion && 'animate-fade-in',
      )}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={cn(
          'max-w-md w-full',
          'bg-[--canvas-elevated] rounded-lg',
          'p-8 shadow-sm',
          'border border-[--text-muted]/10',
        )}
      >
        {/* Error icon */}
        <div className="mb-4 flex justify-center" aria-hidden="true">
          <svg
            className="w-12 h-12 text-[--accent-primary]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error message */}
        <h1 className="text-2xl font-semibold text-[--text-primary] text-center mb-4">
          {ROUTE_ERROR_MESSAGE}
        </h1>

        {/* Retry button */}
        <button
          ref={retryButtonRef}
          type="button"
          onClick={handleRetry}
          className={cn(
            'w-full py-3 px-4 rounded-md',
            'bg-[--accent-primary] text-white',
            'font-medium text-base',
            'hover:opacity-90 active:opacity-80',
            'focus:outline-none focus:ring-2 focus:ring-[--accent-primary] focus:ring-offset-2',
            'transition-opacity duration-200',
            prefersReducedMotion && 'transition-none',
          )}
          aria-label="Reload page and try again"
        >
          Try Again
        </button>

        {/* Navigate back option */}
        <button
          type="button"
          onClick={handleGoBack}
          className={cn(
            'w-full mt-3 py-3 px-4 rounded-md',
            'bg-transparent text-[--text-muted]',
            'font-medium text-base',
            'hover:bg-[--canvas-base] active:bg-[--canvas-base]',
            'focus:outline-none focus:ring-2 focus:ring-[--text-muted] focus:ring-offset-2',
            'transition-colors duration-200',
            prefersReducedMotion && 'transition-none',
          )}
          aria-label="Navigate back to previous page"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  // If fullPage, return just the content (for React Router ErrorBoundary)
  // Otherwise return wrapped (for RouteErrorBoundary component)
  return fullPage ? errorContent : <div>{errorContent}</div>;
}
