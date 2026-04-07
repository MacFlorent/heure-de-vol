import { Component, ReactNode, ErrorInfo } from "react";

import { logger } from "@/utils/logger";
import { Button } from "@/components/ui";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error("Uncaught error in component tree", error);
    logger.debug("Error component stack", errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-danger-50">
          <div className="max-w-md w-full bg-danger-100 shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="shrink-0">
                <svg
                  className="h-8 w-8 text-danger-500"
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
              <h2 className="ml-3 text-xl font-semibold text-neutral-900">
                Something went wrong
              </h2>
            </div>
            <p className="text-danger-600 mb-4">
              An unexpected error occurred. Please try refreshing the page. {this.state.error.name}
            </p>
            <details className="mb-4">
              <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
                Error details
              </summary>
              <pre className="mt-2 text-xs bg-neutral-100 p-3 rounded overflow-auto max-h-48">
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
            <Button variant="danger" className="w-full" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
