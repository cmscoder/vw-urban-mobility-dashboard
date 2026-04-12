import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const VehicleDetailPage = lazy(() => import('@/pages/VehicleDetailPage'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
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
