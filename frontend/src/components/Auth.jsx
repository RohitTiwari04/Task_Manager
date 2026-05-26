import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, CheckCircle, AlertCircle, LogIn, UserPlus, ListTodo } from 'lucide-react';

export default function Auth() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (username.trim() === '' || password.trim() === '') {
      setError('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    if (!isLogin && email.trim() === '') {
      setError('Please enter your email');
      setSubmitting(false);
      return;
    }

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, email, password);
        setSuccess('Account created! You can now log in.');
        setIsLogin(true);
        // Clear fields
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTab = (loginTab) => {
    setError('');
    setSuccess('');
    setIsLogin(loginTab);
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <ListTodo size={32} color="#6366F1" />
            <span>TaskFlow</span>
          </div>
          <p className="auth-subtitle">Elevate your daily productivity</p>
        </div>

        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => toggleTab(true)}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => toggleTab(false)}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? (
              <span>Loading...</span>
            ) : isLogin ? (
              <>
                <LogIn size={18} />
                <span>Get Started</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>
      </div>

      {success && (
        <div className="alert-toast success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert-toast error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
