import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import { Button } from '../components/ui/button';
import { Search, MapPin, Clock, ShieldCheck, Activity, Star, Filter, ChevronRight } from 'lucide-react';

export default function TestSearch() {
  const [keyword, setKeyword] = useState('');
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, items } = useCartStore();

  useEffect(() => {
    fetchTests('');
  }, []);

  const fetchTests = async (query) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/tests/search?keyword=${query}`);
      setTests(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTests(keyword);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 md:px-12 md:py-10 space-y-8">
      
      {/* Cinematic Header & Search */}
      <section className="relative z-10 space-y-6">
        <div>
          <h1 className="text-3xl md:text-6xl font-black tracking-tight mb-2">Molecular Database</h1>
          <p className="text-slate-500 text-sm md:text-lg font-medium">Scanning 1,240+ diagnostic endpoints across verified lab networks.</p>
        </div>

        <form onSubmit={handleSearch} className="relative group max-w-2xl">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all" />
          <div className="relative glass-card !rounded-2xl p-1.5 flex items-center bg-black/40">
            <Search className="w-5 h-5 text-cyan-400 ml-4" />
            <input 
              type="text" 
              placeholder="Search tests, categories, or labs..." 
              className="w-full bg-transparent border-none text-white text-md px-4 py-3 focus:outline-none placeholder:text-slate-600"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-xl font-bold px-6 h-11">
              Filter
            </Button>
          </div>
        </form>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(['All', 'CBC', 'Thyroid', 'Diabetes', 'Vitamin', 'Liver'] || []).map(tag => (
            <button 
              key={tag} 
              onClick={() => { setKeyword(tag === 'All' ? '' : tag); fetchTests(tag === 'All' ? '' : tag); }}
              className={`px-4 py-1.5 rounded-full border text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${keyword === tag || (tag === 'All' && keyword === '') ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-white/10 bg-white/5 text-slate-400'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Test Results */}
      <section className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" /> System Results
          </h2>
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{tests.length} Matches Found</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 glass-card animate-pulse" />
            ))}
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-slate-400">Database Entry Not Found</h3>
            <p className="text-slate-600 text-sm">No matching protocols for "{keyword}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(tests || []).map((test) => (
              <motion.div 
                layout
                key={test._id} 
                className="glass-card group hover:border-cyan-500/30 transition-all overflow-hidden flex flex-col p-4 md:p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">{test.category}</span>
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{test.testName}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white">₹{test.discountedPrice}</p>
                    <p className="text-[10px] text-slate-500 line-through">₹{test.originalPrice}</p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-300 truncate">{test.labId?.labName}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-500/50" /> {test.labId?.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-[10px]">
                      <Star className="w-3 h-3 fill-amber-400" /> 4.9
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <Clock className="w-3 h-3 text-cyan-500/50" /> {test.reportDeliveryTime}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <Activity className="w-3 h-3 text-cyan-500/50" /> Home Sample
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  {items.some(item => item._id === test._id) ? (
                    <Button variant="outline" className="w-full h-11 rounded-xl border-cyan-500/30 text-cyan-500 bg-cyan-500/5 font-bold" disabled>
                      ✓ Protocol Initialized
                    </Button>
                  ) : (
                    <Button 
                      className="w-full h-11 rounded-xl bg-white text-black hover:bg-slate-200 font-black shadow-xl active:scale-95 transition-all" 
                      onClick={() => {
                        const res = addToCart(test, test.labId);
                        if (!res.success) alert(res.message);
                      }}
                    >
                      Book Test
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

