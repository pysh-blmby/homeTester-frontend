import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Search, ShieldCheck, Clock, MapPin, ArrowRight, CheckCircle2, Star, Activity, Heart, Thermometer, Microscope } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?keyword=${searchQuery}`);
  };

  const stats = [
    { label: 'Verified Labs', value: '500+' },
    { label: 'Diagnostic Tests', value: '1200+' },
    { label: 'Happy Families', value: '50k+' },
    { label: 'City Networks', value: '25+' },
  ];

  return (
    <div className="flex flex-col bg-[#f8fafc] min-h-screen">
      
      {/* Hero Section - The Trusted Choice */}
      <section className="relative w-full pt-8 md:pt-16 pb-12 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck size={14} />
              NABL & ISO Certified Network
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
              Healthcare You Can <br/>
              <span className="text-blue-600">Trust at Home.</span>
            </h1>
            
            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-lg mb-10 leading-relaxed">
              Compare prices from top-rated labs, book home collections, and get digital reports within 24 hours. Simple, safe, and reliable.
            </p>

            {/* Smart Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8">
              <div className="bg-white p-2 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col md:flex-row items-center gap-2">
                <div className="flex items-center flex-1 w-full px-4 border-r border-slate-100 last:border-0">
                  <Search className="w-5 h-5 text-slate-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search for blood tests, health packages..." 
                    className="w-full bg-transparent border-none py-4 text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] px-10 h-14 font-bold text-lg transition-all shadow-lg shadow-blue-600/20">
                  Find Labs
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trending:</span>
                {['Full Body Checkup', 'Vitamin D', 'CBC', 'Diabetes'].map(tag => (
                  <button key={tag} onClick={() => setSearchQuery(tag)} className="text-xs font-bold text-blue-600 hover:underline">
                    {tag}
                  </button>
                ))}
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-6 opacity-80">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Verified Labs
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Home Collection
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-blue-600/5 rounded-[3rem] blur-3xl" />
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="/Users/piyush/.gemini/antigravity/brain/7dd09a3e-94a0-449b-888e-3ace1f0b425a/premium_medical_hero_1777956977901.png" 
                alt="Modern Healthcare" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating Info Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Star className="text-emerald-600 w-6 h-6 fill-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Rated</p>
                <p className="font-bold text-slate-900">Best in Class Labs</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-y border-slate-100 py-12">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{stat.value}</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Categories */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Our Specialized Care</h2>
              <p className="text-slate-500 font-medium">Explore a wide range of diagnostic services tailored for you.</p>
            </div>
            <Link to="/search" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Full Body Panels', desc: 'Comprehensive wellness checks', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Cardiac Care', desc: 'Heart health monitoring', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
              { title: 'Fever Profile', desc: 'Rapid viral & bacterial testing', icon: Thermometer, color: 'text-orange-600', bg: 'bg-orange-50' },
              { title: 'Advanced Biotech', desc: 'Specialized hormone & DNA tests', icon: Microscope, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="medical-card p-8 group cursor-pointer"
                onClick={() => navigate(`/search?keyword=${cat.title}`)}
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-all`}>
                  <cat.icon className={`w-7 h-7 ${cat.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">{cat.desc}</p>
                <div className="flex items-center text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                  Book Now <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Trust Building */}
      <section className="bg-slate-900 text-white py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple Steps to Better Health</h2>
            <p className="text-slate-400 text-lg">We've streamlined the diagnostic process to make it as comfortable and efficient as possible.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Find Your Test', desc: 'Search from 1200+ tests and compare prices across verified labs near you.' },
              { step: '02', title: 'Sample Collection', desc: 'Our certified phlebotomists collect samples from your home at your convenience.' },
              { step: '03', title: 'Digital Reports', desc: 'Access your NABL-verified digital reports directly on your dashboard within 24 hours.' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-6xl font-black text-white/5 absolute -top-8 -left-4 group-hover:text-blue-600/20 transition-all">{item.step}</div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Partner CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Own a Diagnostic Lab?</h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">Join our growing network of certified labs and expand your reach. Manage bookings, reports, and payments with our professional console.</p>
              <Link to="/partner">
                <Button className="btn-primary w-full md:w-auto h-16 px-10 text-lg">Register Your Lab</Button>
              </Link>
            </div>
            <div className="relative md:w-1/3">
              <div className="bg-blue-50 p-8 rounded-full">
                <MapPin className="w-32 h-32 text-blue-600 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Helper for chevron
function ChevronRight({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

