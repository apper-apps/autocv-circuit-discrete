import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/organisms/Layout';
import LoginPage from '@/components/pages/LoginPage';
import DashboardPage from '@/components/pages/DashboardPage';
import ProfilePage from '@/components/pages/ProfilePage';
import GenerateResumePage from '@/components/pages/GenerateResumePage';
import HistoryPage from '@/components/pages/HistoryPage';
import Loading from '@/components/ui/Loading';

function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={login} />
            } 
          />
          <Route 
            path="/*" 
            element={
              user ? (
                <Layout user={user} onLogout={logout}>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/generate" element={<GenerateResumePage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;