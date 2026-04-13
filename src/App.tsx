import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
