import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Users, UserCog, Lock, User, Eye, EyeOff, AlertCircle, CheckSquare } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { SCHOOL_NAME } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';

export const Login = () => {
  const { settings } = useSettingsStore();
  const currentSchoolName = settings?.schoolName || SCHOOL_NAME;
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password Reset State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const sendPasswordReset = useAuthStore((state) => state.sendPasswordReset);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const success = await login(email, password);
    if (success) {
      // Logic for redirecting based on role fetched from Firestore
      const userFromStore = useAuthStore.getState().user;
      if (userFromStore?.role) {
        navigate(`/${userFromStore.role}`);
      } else {
        navigate('/');
      }
    } else {
      setError('Invalid credentials or account not set up properly.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const success = await loginWithGoogle();
      if (success) {
        const userFromStore = useAuthStore.getState().user;
        navigate(`/${userFromStore?.role || 'student'}`);
      } else {
        setError('Google sign-in failed. This might be due to a popup blocker or missing authorized domain in Firebase Console.');
      }
    } catch (err: any) {
      console.error('Login Error details:', err);
      setError(`Login Error: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    
    setIsResetting(true);
    setError('');
    setResetSuccess('');
    
    try {
      await sendPasswordReset(resetEmail);
      setResetSuccess('Password reset link sent to your email!');
      setTimeout(() => setIsResetModalOpen(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-12 px-4 bg-cream-50">
      <div className="absolute inset-0 diagonal-pattern opacity-10 pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-navy-800 rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl mx-auto mb-6 transform -rotate-6">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-gold-400" fill="currentColor">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
          </div>
          <h1 className="heading-serif text-3xl font-bold text-navy-950">{currentSchoolName}</h1>
          <p className="text-gray-500 font-medium mt-1">Portal Login</p>
        </div>

        <Card className="overflow-hidden p-0 rounded-3xl border-0 shadow-2xl">
          <div className="bg-navy-900 text-white p-6 text-center border-b border-white/10 relative overflow-hidden">
            <motion.div 
              className="absolute -right-2 -top-2 opacity-20"
              animate={{ 
                rotate: showPassword ? [0, 5, -5, 0] : 0,
                y: password.length > 0 ? -10 : 0
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="text-6xl select-none">
                {showPassword ? '🐵' : (password.length > 0 ? '🙈' : '🎓')}
              </div>
            </motion.div>
            <h3 className="font-bold text-lg relative z-10">Welcome Back</h3>
            <p className="text-navy-200 text-xs mt-1 relative z-10">Please enter your credentials to access the portal</p>
          </div>

          <div className="p-8 space-y-6">
            <Button 
              variant="outline" 
              className="w-full rounded-xl py-6 flex items-center justify-center gap-3 border-gray-200 hover:bg-gray-50 text-gray-700"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Or with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && !isResetModalOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-start shadow-sm"
                >
                  <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="name@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl"
              />
              
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-gray-400 hover:text-navy-800 transition-colors"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={showPassword ? 'eye-off' : 'eye-on'}
                      initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-navy-800 focus:ring-navy-800" />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-navy-950 font-medium">Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => setIsResetModalOpen(true)}
                  className="text-sm font-bold text-navy-800 hover:text-gold-600"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-xl py-4 text-lg"
                isLoading={isLoading}
              >
                Log In
              </Button>
            </form>
          </div>
        </Card>

        {/* Principal's Quote Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white mb-4">
            <img 
              src="https://images.unsplash.com/photo-1544717297-fa154daaf544?auto=format&fit=crop&q=80&w=200" 
              alt="Principal" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="max-w-[300px]">
            <p className="text-gray-500 italic text-sm leading-relaxed">
              "Education is the most powerful weapon which you can use to change the world."
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="h-[1px] w-4 bg-gray-300"></span>
              <span className="text-[10px] font-black uppercase text-navy-900 tracking-widest">Dr. S. K. Sharma</span>
              <span className="h-[1px] w-4 bg-gray-300"></span>
            </div>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">Principal's Desk</p>
          </div>
        </motion.div>
      </div>

      {/* Password Reset Modal */}
      <Modal 
        isOpen={isResetModalOpen} 
        onClose={() => setIsResetModalOpen(false)} 
        title="Reset Password"
      >
        <form onSubmit={handleResetPassword} className="space-y-6">
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && isResetModalOpen && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center">
              <AlertCircle size={18} className="mr-2" />
              {error}
            </div>
          )}

          {resetSuccess && (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm flex items-center border border-emerald-100">
              <CheckSquare size={18} className="mr-2" />
              {resetSuccess}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="your-email@example.com"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
            className="rounded-xl"
          />

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1"
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="flex-1"
              isLoading={isResetting}
            >
              Send Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
