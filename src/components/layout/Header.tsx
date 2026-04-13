import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export function Header({ children }: PropsWithChildren) {
  return (
    <header className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80">
        <Car className="h-6 w-6 shrink-0 text-primary" />
        <div>
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            Urban Mobility Dashboard
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            EU Vehicle Fleet — Electric & Hybrid Registrations
          </p>
        </div>
      </Link>
      {children}
    </header>
  );
}
