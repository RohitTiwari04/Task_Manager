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
        backgroundColor: '#080808',
        color: '#ffffff',
        fontFamily: 'Space Mono, monospace',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="editorial-grid">
          <svg className="grid-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" fill="none" className="geometric-patterns">
              <line x1="0" y1="540" x2="1920" y2="540" />
              <line x1="960" y1="0" x2="960" y2="1080" />
              <circle cx="960" cy="540" r="300" />
              <circle cx="960" cy="540" r="150" />
              <path d="M 960 240 L 1260 540 L 960 840 L 660 540 Z" />
              <path d="M 960 390 L 1110 540 L 960 690 L 810 540 Z" />
              <circle cx="288" cy="540" r="150" />
              <path d="M 288 390 L 438 540 L 288 690 L 138 540 Z" />
              <circle cx="1632" cy="540" r="150" />
              <path d="M 1632 390 L 1782 540 L 1632 690 L 1482 540 Z" />
            </g>
          </svg>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderTopColor: '#ffffff',
          animation: 'spin 1.5s steps(8, end) infinite',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1
        }} />
        <p style={{ 
          fontSize: '12px', 
          color: '#a0a0a0', 
          letterSpacing: '0.2em', 
          fontWeight: '700',
          position: 'relative',
          zIndex: 1
        }}>
          LOADING TASKFLOW.02
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="editorial-grid">
        <svg className="grid-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" fill="none" className="geometric-patterns">
            <line x1="0" y1="540" x2="1920" y2="540" />
            <line x1="960" y1="0" x2="960" y2="1080" />
            <circle cx="960" cy="540" r="300" />
            <circle cx="960" cy="540" r="150" />
            <path d="M 960 240 L 1260 540 L 960 840 L 660 540 Z" />
            <path d="M 960 390 L 1110 540 L 960 690 L 810 540 Z" />
            <circle cx="288" cy="540" r="150" />
            <path d="M 288 390 L 438 540 L 288 690 L 138 540 Z" />
            <circle cx="1632" cy="540" r="150" />
            <path d="M 1632 390 L 1782 540 L 1632 690 L 1482 540 Z" />
          </g>
        </svg>
      </div>
      {user ? <Dashboard /> : <Auth />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
