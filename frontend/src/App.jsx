import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#080B11',
        color: '#F3F4F6',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(99, 102, 241, 0.1)',
          borderTopColor: '#6366F1',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <p style={{ fontSize: '14px', color: '#9CA3AF', letterSpacing: '0.05em' }}>BOOTING TASKFLOW...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
