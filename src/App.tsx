import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { DashboardPage } from '@/pages/DashboardPage';
import { VehicleDetailPage } from '@/pages/VehicleDetailPage';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route
          path="/vehicles/:country/:year"
          element={<VehicleDetailPage />}
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
