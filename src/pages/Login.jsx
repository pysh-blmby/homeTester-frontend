import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { Button } from '../components/ui/button';
import { ShieldCheck, Smartphone, Key, Activity, Fingerprint, Lock, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) setStep(2);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const success = await login(phone, otp);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Subtle Medical Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12"
      >
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Secure Access</h1>
            <p className="text-slate-500 text-sm font-medium">Log in to your private health portal</p>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
            <p className="text-red-600 text-xs font-bold leading-snug">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSendOtp} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                <div className="relative group">
                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="tel" 
                    placeholder="Enter 10-digit number" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-16 pl-14 pr-6 text-lg font-bold text-slate-900 focus:outline-none focus:border-blue-600/30 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/10 active:scale-95 transition-all flex items-center justify-center gap-3">
                Send Verification Code
              </Button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleVerifyOtp} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Verification Code</label>
                <div className="relative group">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="text" 
                    maxLength={4}
                    placeholder="• • • •" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-16 pl-14 pr-6 text-center text-3xl font-bold tracking-[0.5em] text-slate-900 focus:outline-none focus:border-blue-600/30 focus:bg-white transition-all placeholder:text-slate-200"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <p className="text-[10px] text-center text-slate-400 font-medium pt-2 italic">A code has been sent to your mobile device</p>
              </div>
              <Button type="submit" className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/10 active:scale-95 transition-all" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Access My Portal'}
              </Button>
              <button type="button" onClick={() => setStep(1)} className="w-full py-2 text-blue-600 font-bold text-xs flex items-center justify-center gap-2 hover:underline">
                <ArrowLeft size={14} /> Change Number
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400">
          <Lock size={12} />
          <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted Data</span>
        </div>
      </motion.div>

      <div className="mt-8 text-center space-y-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-xs leading-loose">
          Privacy is our priority. Your medical records are stored securely and never shared without consent.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/signup" className="text-blue-600 font-bold text-xs hover:underline">Create Account</Link>
          <div className="w-1 h-1 bg-slate-200 rounded-full" />
          <Link to="/" className="text-slate-400 font-bold text-xs hover:underline">Need Help?</Link>
        </div>
      </div>
    </div>
  );
}

