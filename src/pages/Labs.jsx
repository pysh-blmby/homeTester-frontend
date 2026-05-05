import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MapPin, Search, ShieldCheck, Clock, Activity, Star, ChevronRight, Building2, BadgeCheck, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/ui/Pagination';

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { currentPage, limit, onPageChange } = usePagination(9);

  useEffect(() => {
    fetchLabs(keyword, currentPage, limit);
  }, [currentPage, limit]);

  const fetchLabs = async (searchQuery = '', page, limit) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/labs?keyword=${searchQuery}&page=${page}&limit=${limit}`);
      if (res.data.success) {
        setLabs(res.data.data);
        setPaginationData(res.data.pagination);
      }
    } catch (error) {
      console.error(error);
      // Fallback is removed for production-ready code, but we keep it empty or show error
      setLabs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    onPageChange(1);
    fetchLabs(keyword, 1, limit);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-24 px-4 md:px-12 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header Section */}
      <section className="pt-16 pb-20 space-y-10 relative z-10">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100">
            <BadgeCheck size={14} /> Accreditation Verified
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">Laboratory Directory</h1>
          <p className="text-slate-500 text-sm md:text-xl font-medium leading-relaxed max-w-2xl">
            Access India's most trusted network of NABL and ISO certified diagnostic partners. Reliable results, every single time.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="relative group max-w-3xl">
          <div className="bg-white p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col md:flex-row items-center gap-2">
            <div className="flex items-center flex-1 w-full px-4">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <input 
                type="text" 
                placeholder="Search by lab name, city or locality..." 
                className="w-full bg-transparent border-none text-slate-900 text-lg px-4 py-3 focus:outline-none placeholder:text-slate-300 font-bold"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold px-10 h-14 shadow-xl shadow-blue-600/20 transition-all active:scale-95 text-md">
              Find Partners
            </Button>
          </div>
        </form>
      </section>

      {/* Labs List */}
      <section className="space-y-8 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <Building2 className="w-6 h-6 text-blue-600" /> 
            Qualified Centers
          </h2>
          <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">
            {paginationData?.totalItems || 0} Results Found
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div key={i} className="h-80 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : labs.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No matching centers found</h3>
            <p className="text-slate-400 font-medium max-w-xs leading-relaxed">Try adjusting your search criteria or check for spelling errors.</p>
            <Button variant="outline" className="mt-8 rounded-xl font-bold px-8" onClick={() => { setKeyword(''); onPageChange(1); fetchLabs('', 1, limit); }}>Reset Filters</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {labs.map((lab) => (
                <motion.div 
                  layout
                  key={lab._id} 
                  className="medical-card p-10 flex flex-col group relative overflow-hidden bg-white hover:shadow-[0_30px_60px_rgba(37,99,235,0.08)] transition-all duration-500"
                >
                  {/* Popular Badge */}
                  {lab.rating >= 4.7 && (
                    <div className="absolute top-6 right-6 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-amber-100 flex items-center gap-1 z-20">
                      <Star className="w-3 h-3 fill-amber-600" /> Top Rated
                    </div>
                  )}
                  
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100/40 transition-colors" />
                  
                  <div className="mb-8 space-y-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-widest rounded border border-emerald-100">NABL Certified</div>
                      <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-widest rounded border border-blue-100 flex items-center gap-1"><ShieldCheck size={10}/> Verified</div>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">{lab.labName}</h3>
                    <div className="flex items-start gap-2 text-slate-500 font-medium">
                      <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-sm">{lab.city}, {lab.address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={10} /> Timings</p>
                      <p className="text-xs font-bold text-slate-800">{lab.operatingTimings?.open.split(' ')[0]} - {lab.operatingTimings?.close}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Zap size={10} /> Logistics</p>
                      <p className="text-xs font-bold text-emerald-600">Home Collection</p>
                    </div>
                  </div>

                  <div className="mt-auto relative z-10 flex items-center gap-4">
                    <Link to={`/labs/${lab._id}`} className="flex-1">
                      <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white hover:bg-black font-bold shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn">
                        Explore Center
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-100 shrink-0">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {paginationData && (
              <Pagination 
                {...paginationData} 
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
      </section>

      {/* Trust Footer Indicator */}
      <section className="mt-24 pt-12 border-t border-slate-100 text-center space-y-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Medical Standards Partner</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale group-hover:grayscale-0 transition-all">
          <div className="font-black text-2xl text-slate-300">NABL</div>
          <div className="font-black text-2xl text-slate-300">ISO 9001</div>
          <div className="font-black text-2xl text-slate-300">CAP</div>
          <div className="font-black text-2xl text-slate-300">NMC</div>
        </div>
      </section>
    </div>
  );
}
