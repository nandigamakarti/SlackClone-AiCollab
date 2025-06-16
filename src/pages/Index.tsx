import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

type AuthStep = 'login' | 'signup' | 'forgot-password';

const Index: React.FC = () => {
  const { isAuthenticated, isLoading, user, session } = useAuth();
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const navigate = useNavigate();
  
  // Debug authentication state in Index component
  useEffect(() => {
    console.log('Index component auth state:', { 
      isAuthenticated, 
      isLoading, 
      hasUser: !!user, 
      hasSession: !!session,
      userEmail: user?.email
    });
  }, [isAuthenticated, isLoading, user, session]);
  
  // Handle navigation when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('User is authenticated, redirecting to workspaces page');
      navigate('/workspaces', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 relative">
              <svg 
                className="w-8 h-8 text-white opacity-50"
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L14.8 7.6L21 8.4L16.5 12.8L17.6 19L12 16.1L6.4 19L7.5 12.8L3 8.4L9.2 7.6L12 2Z" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white" 
                />
              </svg>
              <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Loading
            </h1>
            <p className="text-sm text-gray-500">
              Please wait while we prepare your workspace
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const handleSwitchToSignUp = () => {
    setAuthStep('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthStep('login');
  };

  const handleForgotPassword = () => {
    setAuthStep('forgot-password');
  };

  // Show authentication forms for non-authenticated users
  switch (authStep) {
    case 'login':
      return (
        <LoginForm
          workspaceUrl=""
          onBack={() => {}} // Not needed in new flow
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSwitchToSignUp}
        />
      );

    case 'signup':
      return (
        <SignUpForm
          onBack={handleSwitchToLogin}
          onSignIn={handleSwitchToLogin}
          isCreatingWorkspace={false}
        />
      );
      
    case 'forgot-password':
      return (
        <ForgotPasswordForm
          onBack={handleSwitchToLogin}
        />
      );

    default:
      return (
        <LoginForm
          workspaceUrl=""
          onBack={() => {}}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSwitchToSignUp}
        />
      );
  }
};

export default Index;
