import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import TrackComplaintPage from './pages/TrackComplaintPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ComplaintsListPage from './pages/admin/ComplaintsListPage';
import ComplaintDetailPage from './pages/admin/ComplaintDetailPage';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="submit" element={<SubmitComplaintPage />} />
          <Route path="track" element={<TrackComplaintPage />} />
          <Route path="track/:complaintId" element={<TrackComplaintPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        
        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="complaints" element={<ComplaintsListPage />} />
          <Route path="complaints/:complaintId" element={<ComplaintDetailPage />} />
          <Route path="complaints/:status" element={<ComplaintsListPage />} />
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={<MainLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;