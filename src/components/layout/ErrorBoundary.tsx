import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level error boundary that catches unhandled React errors and
 * displays a user-friendly recovery UI with "Refresh" and "Try Again" actions.
 * Logs the error and component stack to the console for debugging.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
              <CardTitle className="mt-3">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-muted-foreground">
                An unexpected error occurred. You can try again or refresh the
                page.
              </p>
              {this.state.error && (
                <pre className="mt-4 overflow-auto rounded-md bg-muted p-3 text-xs">
                  {this.state.error.message}
                </pre>
              )}
            </CardContent>
            <CardFooter className="justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
              <Button onClick={this.handleReset}>Try Again</Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
