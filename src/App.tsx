import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { DashboardPage } from '@/pages/DashboardPage';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
