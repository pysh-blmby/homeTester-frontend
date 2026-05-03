import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { Button } from '../components/ui/button';
import { Shield, Smartphone, Key, Activity, Fingerprint } from 'lucide-react';

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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Holographic Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.2)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass-card p-8 md:p-12 space-y-10"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
            <Fingerprint className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Bio-Portal</h1>
          <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">Neural Encryption Active</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl text-center">
            Auth Signal Denied: {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendOtp} 
              className="space-y-6"
            >
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="tel" 
                  placeholder="Mobile ID (10 Digits)" 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-16 pl-12 pr-4 text-lg font-bold tracking-widest focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700 placeholder:font-normal placeholder:tracking-normal"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-16 bg-white text-black font-black rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest text-[10px]">
                Initialize Secure Link
              </Button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp} 
              className="space-y-6"
            >
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="Encryption Key (OTP)" 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-16 pl-12 pr-4 text-center text-2xl font-black tracking-[1em] focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-16 bg-cyan-500 text-black font-black rounded-2xl shadow-xl shadow-cyan-500/20 active:scale-95 transition-all uppercase tracking-widest text-[10px]" disabled={isLoading}>
                {isLoading ? 'Verifying Neural Pattern...' : 'Grant Access'}
              </Button>
              <Button variant="ghost" onClick={() => setStep(1)} className="w-full h-12 text-slate-600 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">
                Reset Link
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-10 text-[10px] font-black text-slate-700 uppercase tracking-widest text-center max-w-xs leading-loose">
        By entering, you agree to the decentralized health protocol & telemetry usage policies.
      </p>
    </div>
  );
}

