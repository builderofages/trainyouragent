import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Landing Page Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: true,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
          <div className="max-w-md w-full bg-background rounded-lg shadow-xl p-8 text-center border border-border">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-foreground">Something Went Wrong</h1>
            <p className="text-muted-foreground mb-6">
              We encountered an unexpected error while loading this page. Our team has been notified.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-primary/5 border border-primary/20 rounded p-4 mb-6 text-left">
                <p className="text-sm font-mono text-foreground break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={this.handleReset} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Need help? Contact us at{' '}
              <a href="mailto:support@trainyouragent.com" className="text-primary hover:underline">
                support@trainyouragent.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
