import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Activity, MapPin, Calendar, Clock, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, ClipboardList, User } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { Button } from '../components/ui/button';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    'Pending': { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock, progress: 20 },
    'Confirmed': { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: CheckCircle2, progress: 40 },
    'Sample Collected': { color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Activity, progress: 60 },
    'Processing': { color: 'text-cyan-400', bg: 'bg-cyan-400/10', icon: RefreshCw, progress: 80 },
    'Completed': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle2, progress: 100 },
    'Report Uploaded': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: FileText, progress: 100 },
  };

  if (loading) return <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
    <Activity className="animate-spin text-cyan-400 w-10 h-10" />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Syncing Health Data</span>
  </div>;

  return (
    <div className="min-h-screen bg-black text-white pb-24 px-4 md:px-12 selection:bg-cyan-500/30">
      
      {/* Premium Profile Header */}
      <div className="pt-6 pb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Bio-Hub</h1>
          <p className="text-slate-500 text-xs md:text-lg font-medium flex items-center gap-2">
            Patient: <span className="text-cyan-400">{user?.name || 'Authorized User'}</span>
          </p>
        </div>
        <div className="w-14 h-14 rounded-3xl glass-card flex items-center justify-center border-cyan-500/20">
          <User className="w-6 h-6 text-cyan-400" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Active Scans', val: bookings.filter(b => b.status !== 'Completed').length, icon: Activity },
          { label: 'Total Records', val: bookings.length, icon: ClipboardList },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 flex flex-col justify-between h-28">
            <stat.icon className="w-5 h-5 text-cyan-500" />
            <div>
              <p className="text-2xl font-black">{stat.val}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-500" /> Live Diagnostics
          </h2>
          <Button variant="ghost" size="sm" onClick={fetchBookings} className="text-slate-500 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {bookings.length === 0 ? (
          <div className="glass-card p-12 text-center flex flex-col items-center">
            <AlertCircle className="w-10 h-10 text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-slate-400">No telemetry data found</h3>
            <p className="text-slate-600 text-sm mb-6">Initialize your first diagnostic scan to view history.</p>
            <Button className="bg-white text-black font-black rounded-2xl px-8 h-12">Scan Database</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map(booking => {
              const status = statusMap[booking.status] || statusMap['Pending'];
              return (
                <motion.div 
                  key={booking._id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card group p-5 md:p-8 relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full ${status.bg} ${status.color} text-[10px] font-black uppercase tracking-tighter flex items-center gap-2`}>
                          <status.icon className="w-3 h-3" /> {booking.status}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">ID: {booking._id.substring(booking._id.length - 8)}</span>
                      </div>
                      
                      <div>
                        <h3 className="text-xl md:text-2xl font-black group-hover:text-cyan-400 transition-colors">{booking.labId?.labName}</h3>
                        <p className="text-slate-500 text-xs flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-500/50" /> {booking.labId?.city}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {booking.tests.map(t => (
                          <span key={t._id} className="text-[10px] font-bold bg-white/5 border border-white/5 px-2 py-1 rounded-lg text-slate-400">
                            {t.testName}
                          </span>
                        ))}
                      </div>

                      {/* Visual Progress Pipeline */}
                      <div className="pt-4">
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${status.progress}%` }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:w-64 space-y-4">
                      <div className="glass-card !rounded-2xl p-4 bg-white/[0.02] space-y-2">
                        <p className="text-xs text-slate-500 flex justify-between font-medium">
                          <span>Collection</span>
                          <span className="text-slate-300">{new Date(booking.slot).toLocaleDateString()}</span>
                        </p>
                        <p className="text-xs text-slate-500 flex justify-between font-medium">
                          <span>Timeline</span>
                          <span className="text-slate-300">{new Date(booking.slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                        <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Value Paid</span>
                          <span className="text-lg font-black">₹{booking.amountPaid}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {booking.reportUrl ? (
                          <Button className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-black rounded-xl h-12 shadow-lg shadow-cyan-500/20" onClick={() => window.open(booking.reportUrl, '_blank')}>
                            <Download className="w-4 h-4 mr-2" /> Decoded Report
                          </Button>
                        ) : (
                          <Button variant="ghost" disabled className="w-full bg-white/5 border border-white/5 text-slate-600 rounded-xl h-12 flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

