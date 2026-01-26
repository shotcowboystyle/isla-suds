import {Component} from 'react';
import type {ErrorInfo, ReactNode} from 'react';

interface ComponentErrorBoundaryProps {
  /** Custom fallback UI to display when component errors */
  fallback?: ReactNode;
  /** Callback invoked when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: ReactNode;
}

interface ComponentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Component-level error boundary for feature isolation.
 * Allows individual components to fail gracefully without crashing the entire app.
 *
 * Features:
 * - Catches errors in child components
 * - Custom fallback UI via `fallback` prop
 * - Error callback via `onError` prop
 * - Logs errors to console for debugging
 * - Enables graceful degradation (commerce works even if animations fail)
 *
 * Usage:
 * ```tsx
 * <ComponentErrorBoundary fallback={<StaticImage />}>
 *   <TextureReveal />
 * </ComponentErrorBoundary>
 * ```
 */
export class ComponentErrorBoundary extends Component<
  ComponentErrorBoundaryProps,
  ComponentErrorBoundaryState
> {
  constructor(props: ComponentErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error): ComponentErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details to console for debugging
    console.error('ComponentErrorBoundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      boundaryType: 'component',
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided, otherwise render nothing (graceful degradation)
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
