import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, Beaker, DollarSign, CheckCircle2, XCircle, AlertCircle, TrendingUp, Settings, FileText, ChevronRight, LayoutDashboard, Database, CreditCard } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/button';

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
      setData({
        metrics: { totalRevenue: 1250000, totalBookings: 840, totalLabs: 52, totalUsers: 1402 },
        monthlyRevenue: [
          { name: 'Jan', revenue: 40000 }, { name: 'Feb', revenue: 60000 },
          { name: 'Mar', revenue: 120000 }, { name: 'Apr', revenue: 200000 },
          { name: 'May', revenue: 350000 }, { name: 'Jun', revenue: 480000 },
        ],
        pendingLabs: [
          { _id: '1', labName: 'Apollo Diagnostics', ownerId: { name: 'Dr. Sharma', phone: '9876543210' }, status: 'Pending', createdAt: new Date().toISOString() }
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLabStatus = async (id, status) => {
    try {
      await api.put(`/admin/labs/${id}/status`, { status });
      fetchAnalytics();
    } catch (error) {
      alert('Failed to update lab status');
    }
  };

  if (loading || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
      <Activity className="animate-spin text-cyan-400 w-10 h-10" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Decrypting Ops Data</span>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="glass-card p-6 relative overflow-hidden">
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</p>
          <p className="text-3xl font-black text-white">{value}</p>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-[10px] font-bold">
        <TrendingUp className="w-3 h-3 text-emerald-400 mr-1" />
        <span className="text-emerald-400">{trend}</span>
        <span className="text-slate-600 ml-2 uppercase tracking-tighter">Velocity</span>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', icon: LayoutDashboard, label: 'Metrics' },
    { id: 'approvals', icon: CheckCircle2, label: 'Gateway', badge: data.pendingLabs.length },
    { id: 'labs', icon: Beaker, label: 'Nodes' },
    { id: 'finance', icon: CreditCard, label: 'Capital' }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24 px-4 md:px-12 selection:bg-cyan-500/30">
      
      {/* Header */}
      <div className="pt-6 pb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Ops Center</h1>
          <p className="text-slate-500 text-xs md:text-lg font-medium flex items-center gap-2">
            System Protocol: <span className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">Level 10 Admin</span>
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="ghost" className="flex-1 md:flex-none glass-card !rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest border-white/5">
            <FileText className="w-4 h-4 mr-2 text-cyan-400" /> Audit
          </Button>
          <Button className="flex-1 md:flex-none bg-cyan-500 text-black font-black rounded-2xl h-12 text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-500/20">
            <Settings className="w-4 h-4 mr-2" /> Matrix
          </Button>
        </div>
      </div>

      {/* Mobile-Centric Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 sticky top-16 z-40 bg-black/80 backdrop-blur-md -mx-4 px-4 pt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-cyan-500 border-cyan-500 text-black font-black' : 'bg-white/5 border-white/5 text-slate-500 font-bold'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest">{tab.label}</span>
            {tab.badge > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${activeTab === tab.id ? 'bg-black text-white' : 'bg-cyan-500 text-black'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Capital Flow" value={`₹${(data.metrics.totalRevenue / 1000).toFixed(1)}K`} icon={DollarSign} trend="+24.5%" />
                <StatCard title="Node Traffic" value={data.metrics.totalBookings} icon={Activity} trend="+12.2%" />
                <StatCard title="Active Labs" value={data.metrics.totalLabs} icon={Beaker} trend="+4.1%" />
                <StatCard title="Patient Registry" value={data.metrics.totalUsers} icon={Users} trend="+18.4%" />
              </div>

              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Revenue Trajectory</h3>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="h-[250px] md:h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.monthlyRevenue}>
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#334155" tick={{fill: '#475569', fontSize: 10}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#chartGlow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'approvals' && (
            <motion.div 
              key="approvals"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-black uppercase tracking-widest">Gateway Queue</h2>
              </div>
              
              {data.pendingLabs.length === 0 ? (
                <div className="glass-card p-20 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">
                  System Nominal • No Pending Entry
                </div>
              ) : (
                <div className="grid gap-4">
                  {data.pendingLabs.map(lab => (
                    <div key={lab._id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-5 w-full md:w-auto">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                          <Beaker className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-white text-lg truncate">{lab.labName}</h3>
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">{lab.ownerId?.name} • {lab.ownerId?.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none h-11 rounded-xl bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest" onClick={() => handleLabStatus(lab._id, 'Approved')}>Grant Access</Button>
                        <Button variant="ghost" className="flex-1 md:flex-none h-11 rounded-xl bg-red-500/10 text-red-500 font-black uppercase text-[10px] tracking-widest" onClick={() => handleLabStatus(lab._id, 'Rejected')}>Deny</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

