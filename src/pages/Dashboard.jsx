import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Activity, MapPin, Calendar, Clock, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, ClipboardList, User, ShieldCheck } from 'lucide-react';
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
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    'Pending': { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, progress: 20 },
    'Confirmed': { color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle2, progress: 40 },
    'Sample Collected': { color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Activity, progress: 60 },
    'Processing': { color: 'text-violet-600', bg: 'bg-violet-50', icon: RefreshCw, progress: 80 },
    'Completed': { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2, progress: 100 },
    'Report Uploaded': { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: FileText, progress: 100 },
  };

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading your health portal...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-24 px-4 md:px-12">
      
      {/* Profile Header */}
      <div className="pt-10 pb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Health Dashboard</h1>
          <p className="text-slate-500 text-sm md:text-lg font-medium flex items-center gap-2">
            Welcome back, <span className="text-blue-600 font-bold">{user?.name || 'Patient'}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical ID</p>
            <p className="text-sm font-bold text-slate-700">HT-{user?._id?.substring(0, 6).toUpperCase()}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Active Bookings', val: bookings.filter(b => b.status !== 'Completed' && b.status !== 'Report Uploaded').length, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Reports', val: bookings.filter(b => b.status === 'Report Uploaded').length, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Tests', val: bookings.reduce((acc, b) => acc + b.tests.length, 0), icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Verified Labs', val: new Set(bookings.map(b => b.labId?._id)).size, icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none">{stat.val}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" /> Recent Bookings
          </h2>
          <Button variant="ghost" size="sm" onClick={fetchBookings} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No bookings found</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">You haven't booked any diagnostic tests yet. Your medical history and reports will appear here once you start.</p>
            <Button onClick={() => navigate('/tests')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-10 h-12 shadow-lg shadow-blue-600/10 transition-all active:scale-95">
              Browse Available Tests
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {(bookings || []).map(booking => {
              const status = statusMap[booking.status] || statusMap['Pending'];
              return (
                <motion.div 
                  key={booking._id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="medical-card p-6 md:p-8 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className={`px-4 py-1.5 rounded-full ${status.bg} ${status.color} text-[10px] font-bold uppercase tracking-wider flex items-center gap-2`}>
                          <status.icon className="w-3.5 h-3.5" /> {booking.status}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1.5 rounded-full bg-slate-50">
                          Ref: {booking._id.substring(booking._id.length - 8).toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{booking.labId?.labName}</h3>
                        <div className="flex items-center gap-4">
                          <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-500" /> {booking.labId?.city}</p>
                          <div className="h-4 w-px bg-slate-200" />
                          <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-500" /> {new Date(booking.slot).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {booking.tests.map(t => (
                          <span key={t._id} className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100">
                            {t.testName}
                          </span>
                        ))}
                      </div>

                      {/* Status Progress */}
                      <div className="space-y-2 max-w-md">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>Progress</span>
                          <span className={status.color}>{status.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${status.progress}%` }}
                            className={`h-full ${status.bg.replace('bg-', 'bg-').replace('-50', '-500')} bg-blue-500`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-72">
                      <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100 shadow-inner">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">Collection Date</span>
                            <span className="text-slate-700 font-bold">{new Date(booking.slot).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">Preferred Slot</span>
                            <span className="text-slate-700 font-bold">{new Date(booking.slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Amount Paid</span>
                          <span className="text-xl font-bold text-slate-900">₹{booking.amountPaid}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        {booking.reportUrl ? (
                          <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-14 shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 transition-all active:scale-95" 
                            onClick={() => window.open(booking.reportUrl, '_blank')}
                          >
                            <Download className="w-5 h-5" /> Download Report
                          </Button>
                        ) : (
                          <div className="w-full bg-white border border-slate-200 text-slate-400 rounded-xl h-14 flex items-center justify-center gap-3 font-bold text-sm cursor-default">
                            <RefreshCw className="w-4 h-4 animate-spin" /> {booking.status === 'Processing' ? 'Generating Report...' : 'Processing...'}
                          </div>
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

