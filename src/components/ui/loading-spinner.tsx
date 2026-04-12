import { Loader2 } from 'lucide-react';

/**
 * Reusable loading indicator with an animated spinner and optional message.
 * Used as the Suspense fallback and inline loading state across the app.
 *
 * @param message - Optional text displayed below the spinner.
 * @param fullScreen - If true, centers the spinner in the full viewport.
 */
interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message = 'Loading…',
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-8'}`}
      role="status"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
