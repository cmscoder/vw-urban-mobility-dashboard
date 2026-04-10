import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const VehicleDetailPage = lazy(() => import('@/pages/VehicleDetailPage'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-muted-foreground text-sm">Loading…</div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/vehicles/:country/:year"
            element={<VehicleDetailPage />}
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
