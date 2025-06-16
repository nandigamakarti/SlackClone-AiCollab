import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if there's a hash fragment for password reset
  useEffect(() => {
    const handleHashChange = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        console.log('Password reset detected in URL');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        setError(error.message || 'Failed to reset password. Please try again.');
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20">
          <CardHeader className="text-center pb-8">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isSubmitted ? "Password updated" : "Reset password"}
            </h1>
            <p className="text-slate-600">
              {isSubmitted 
                ? "Your password has been successfully reset" 
                : "Please enter and confirm your new password"}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="h-12 text-lg bg-white text-slate-800 border-2 border-slate-300 focus:border-purple-500 rounded-xl pr-12 transition-colors"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="h-12 text-lg bg-white text-slate-800 border-2 border-slate-300 focus:border-purple-500 rounded-xl transition-colors"
                    required
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all duration-200"
                >
                  {isLoading ? 'Updating...' : 'Reset Password'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-slate-700">
                  Your password has been successfully updated. You can now use your new password to sign in.
                </p>
                <Button
                  onClick={handleBackToLogin}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-3 px-6 shadow-lg"
                >
                  Return to login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordForm; 