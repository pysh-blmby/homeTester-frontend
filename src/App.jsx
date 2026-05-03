import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layout & Pages
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Labs from './pages/Labs';
import LabDetails from './pages/LabDetails';
import TestSearch from './pages/TestSearch';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import LabOwnerDashboard from './pages/LabOwnerDashboard';
import LabOnboarding from './pages/LabOnboarding';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="partner" element={<LabOnboarding />} />
          <Route path="labs" element={<Labs />} />
          <Route path="labs/:id" element={<LabDetails />} />
          <Route path="search" element={<TestSearch />} />
          <Route path="cart" element={<Cart />} />
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lab-dashboard" element={<LabOwnerDashboard />} />
            <Route path="admin" element={<SuperAdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
