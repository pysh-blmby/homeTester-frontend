import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import { Button } from '../components/ui/button';
import { Search, MapPin, Clock, ShieldCheck, Activity, Star, Filter, ChevronRight, Stethoscope } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 px-4 py-8 md:px-12 md:py-12 space-y-10">
      
      {/* Header & Search */}
      <section className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Diagnostic Search</h1>
          <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed">
            Browse over 1,200 diagnostic tests from NABL-certified laboratories. 
            Compare prices and book your health checkup in minutes.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative group">
          <div className="bg-white p-2 rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center">
            <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
            <input 
              type="text" 
              placeholder="Search tests (e.g. CBC, Thyroid, Full Body...)" 
              className="w-full bg-transparent border-none text-slate-900 text-md px-4 py-3 focus:outline-none placeholder:text-slate-400 font-medium"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-8 h-12 shadow-lg shadow-blue-600/10">
              Search
            </Button>
          </div>
        </form>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(['All', 'CBC', 'Thyroid', 'Diabetes', 'Vitamin D', 'Lipid Profile'] || []).map(tag => (
            <button 
              key={tag} 
              onClick={() => { setKeyword(tag === 'All' ? '' : tag); fetchTests(tag === 'All' ? '' : tag); }}
              className={`px-5 py-2 rounded-full border text-xs font-bold transition-all whitespace-nowrap ${keyword === tag || (tag === 'All' && keyword === '') ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Test Results */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" /> 
            Available Tests
          </h2>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{tests.length} Results Found</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-white rounded-[1.5rem] border border-slate-100 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No tests found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">We couldn't find any matching tests for "{keyword}". Please try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(tests || []).map((test) => (
              <motion.div 
                layout
                key={test._id} 
                className="medical-card p-6 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md">
                      {test.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{test.testName}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">₹{test.discountedPrice}</p>
                    {test.originalPrice > test.discountedPrice && (
                      <p className="text-xs text-slate-400 line-through">₹{test.originalPrice}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{test.labId?.labName}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" /> {test.labId?.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-white px-2 py-1 rounded-lg shadow-sm">
                      <Star className="w-3 h-3 fill-amber-500" /> 4.9
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Clock className="w-4 h-4 text-slate-400" /> {test.reportDeliveryTime}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Activity className="w-4 h-4 text-slate-400" /> Home Collection
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  {items.some(item => item._id === test._id) ? (
                    <Button variant="outline" className="w-full h-12 rounded-xl border-emerald-200 text-emerald-600 bg-emerald-50 font-bold cursor-default hover:bg-emerald-50">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> In Cart
                    </Button>
                  ) : (
                    <Button 
                      className="w-full h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/10 transition-all active:scale-95" 
                      onClick={() => {
                        const res = addToCart(test, test.labId);
                        if (!res.success) alert(res.message);
                      }}
                    >
                      Book Now
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

