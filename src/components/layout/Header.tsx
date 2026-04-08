import { Car } from 'lucide-react';

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-3">
        <Car className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Urban Mobility Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            EU Vehicle Fleet — Electric & Hybrid Registrations
          </p>
        </div>
      </div>
      {children}
    </header>
  );
}
