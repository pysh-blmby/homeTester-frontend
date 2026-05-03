import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Search, Activity, Clock, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, Fingerprint, Dna, MapPin, Star, Zap, Microscope } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?keyword=${searchQuery}`);
  };

  const trustBadges = [
    { label: 'NABL Certified', icon: ShieldCheck },
    { label: 'Home Collection', icon: MapPin },
    { label: '24h Reports', icon: Clock },
    { label: 'AI Driven', icon: Zap },
  ];

  return (
    <div className="flex flex-col items-center bg-black text-white min-h-screen overflow-x-hidden w-full font-sans selection:bg-cyan-500/30">
      
      {/* Immersive Biotech Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/20 blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[140px]" />
        <div className="absolute top-[30%] right-[10%] w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
      </div>

      {/* Hero Section: The Scanner */}
      <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-start pt-10 md:pt-20 pb-10 z-10 px-4">
        
        {/* Dominant Holographic Body */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.7, rotateY: -20 }}
            animate={{ opacity: 0.6, scale: 1.1, rotateY: 10 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="relative w-full max-w-2xl h-full flex justify-center perspective-1000"
          >
            <svg viewBox="0 0 200 500" className="h-[90vh] md:h-[110vh] drop-shadow-[0_0_50px_rgba(34,211,238,0.4)] opacity-80">
              <defs>
                <linearGradient id="hologram" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path 
                d="M100 20 C115 20 125 35 125 50 C125 65 110 75 100 80 C90 75 75 65 75 50 C75 35 85 20 100 20 Z M70 100 C110 90 130 90 130 100 C150 110 160 150 155 220 C150 290 140 300 130 280 C120 260 115 220 115 220 C115 220 110 280 110 350 C110 420 120 580 110 620 C100 630 80 630 70 620 C60 580 70 420 70 350 C70 280 65 220 65 220 C65 220 60 260 50 280 C40 300 30 290 25 220 C20 150 30 110 70 100 Z" 
                fill="none" 
                stroke="url(#hologram)" 
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />
              {/* Scan Line */}
              <motion.line 
                x1="0" y1="0" x2="200" y2="0" 
                stroke="#22d3ee" strokeWidth="4"
                animate={{ y: [50, 450, 50] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md"
          >
            Biometric Protocol Active
          </motion.div>

          <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
            Your Health, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Decoded.</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-xl font-medium max-w-xl mb-10 leading-relaxed">
            Instant diagnostic intelligence for the modern era. Search 1200+ tests and compare verified labs in real-time.
          </p>

          {/* Futuristic Search */}
          <form onSubmit={handleSearch} className="w-full max-w-xl group relative mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all" />
            <div className="relative glass-card !rounded-3xl p-1.5 flex items-center bg-black/40">
              <Search className="w-5 h-5 text-cyan-400 ml-4" />
              <input 
                type="text" 
                placeholder="Search Test (CBC, Thyroid...)" 
                className="w-full bg-transparent border-none text-white text-md px-4 py-3 focus:outline-none placeholder:text-slate-600 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-2xl font-black px-6 h-11 transition-all active:scale-95">
                Scan
              </Button>
            </div>
          </form>

          {/* Floating Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-60">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <badge.icon className="w-4 h-4 text-cyan-500" />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Molecular Categories */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Diagnostic Matrix</h2>
          <Link to="/search" className="text-cyan-400 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
            Full Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { title: 'Full Body', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
            { title: 'Blood Sugar', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { title: 'Thyroid', icon: Dna, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { title: 'Microbiome', icon: Microscope, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          ].map((cat, i) => (
            <Link key={i} to={`/search?keyword=${cat.title}`}>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className="glass-card !rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center group hover:border-cyan-500/50 transition-all"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${cat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-all`}>
                  <cat.icon className={`w-6 h-6 md:w-8 md:h-8 ${cat.color}`} />
                </div>
                <h3 className="font-bold text-sm md:text-lg">{cat.title}</h3>
                <p className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase tracking-widest">Protocol</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Native-Like Featured Tests (Horizontal Scroll for Mobile) */}
      <section className="relative z-10 w-full py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h2 className="text-2xl font-black">Recommended Panels</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-8 no-scrollbar snap-x">
          {[
            { name: 'Executive Checkup', price: '2999', labs: '12', time: '12h' },
            { name: 'Vitamin Profile', price: '999', labs: '24', time: '6h' },
            { name: 'Liver Function', price: '499', labs: '45', time: '4h' },
            { name: 'Kidney Health', price: '599', labs: '18', time: '8h' },
          ].map((test, i) => (
            <div key={i} className="min-w-[280px] md:min-w-[320px] snap-center">
              <div className="glass-card p-6 !rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
                  <Activity className="w-24 h-24" />
                </div>
                <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-tighter">Fast Report</div>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" /> 4.9
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{test.name}</h3>
                <p className="text-xs text-slate-500 mb-6">Available in {test.labs} premium labs</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-white">₹{test.price}</span>
                  </div>
                  <Button className="bg-white text-black hover:bg-slate-200 rounded-2xl h-10 px-6 font-bold shadow-xl">Book</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* App Promo CTA */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 mb-10">
        <div className="glass-card !rounded-[3rem] p-10 md:p-20 relative overflow-hidden bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/20 text-center flex flex-col items-center">
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[80%] bg-cyan-500/10 blur-[100px] rounded-full" />
          <h2 className="text-3xl md:text-6xl font-black mb-6">Partner With the Network</h2>
          <p className="text-slate-400 text-lg max-w-2xl mb-10">Join India's smartest diagnostic ecosystem. list your lab and manage operations with our enterprise-grade console.</p>
          <Link to="/partner">
            <Button size="lg" className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-full h-16 px-12 font-black text-xl shadow-[0_0_30px_rgba(34,211,238,0.4)]">
              Partner with Us <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}

