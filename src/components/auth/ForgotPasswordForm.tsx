import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message || 'Failed to send reset email. Please try again.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20">
          <CardHeader className="text-center pb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="absolute left-4 top-4 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset password</h1>
            <p className="text-slate-600">
              {isSubmitted 
                ? "We've sent you instructions to reset your password" 
                : "Enter your email and we'll send you instructions to reset your password"}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="h-12 text-lg bg-white text-slate-800 border-2 border-slate-300 focus:border-purple-500 rounded-xl transition-colors"
                    required
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all duration-200"
                >
                  {isLoading ? 'Sending...' : 'Send reset instructions'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-slate-700">
                  We've sent an email to <span className="font-semibold">{email}</span> with instructions to reset your password.
                </p>
                <p className="text-slate-500 text-sm">
                  If you don't see the email in your inbox, please check your spam folder.
                </p>
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="mt-4 text-purple-600 border-2 border-purple-200 hover:bg-purple-50 rounded-xl py-3 px-4"
                >
                  Return to login
                </Button>
              </div>
            )}
            
            {!isSubmitted && (
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={onBack}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Back to login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm; 