import {Component, type ReactNode} from 'react';

/**
 * Error boundary for Framer Motion lazy-loaded components
 * Provides graceful fallback if Framer Motion fails to load (AC4)
 */
interface MotionErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface MotionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class MotionErrorBoundary extends Component<
  MotionErrorBoundaryProps,
  MotionErrorBoundaryState
> {
  constructor(props: MotionErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error): MotionErrorBoundaryState {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging (AC4 requirement)
    console.warn('Framer Motion failed to load:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Graceful fallback: render static content (AC4)
      return (
        this.props.fallback || (
          <div className="rounded-lg bg-canvas-elevated p-6">
            <p className="text-text-muted">
              Animation unavailable. Content still accessible.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
