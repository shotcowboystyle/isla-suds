import {Component} from 'react';
import type {ErrorInfo, ReactNode} from 'react';

import {RouteErrorFallback} from './RouteErrorFallback';

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Route-level error boundary that catches page-level errors
 * and displays warm, non-accusatory error messages.
 *
 * Features:
 * - Catches errors during route rendering
 * - Displays warm error message (no technical details)
 * - Includes retry mechanism (reload page)
 * - Logs errors to console for debugging
 * - Accessible (keyboard nav, screen reader friendly, focus trap)
 * - Respects prefers-reduced-motion
 *
 * Note: For React Router 7, use the ErrorBoundary export function in root.tsx.
 * This component is available for non-React Router use cases.
 */
export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details to console for debugging
    console.error('RouteErrorBoundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      boundaryType: 'route',
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <RouteErrorFallback />;
    }

    return this.props.children;
  }
}
