import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, ShoppingBag, ShieldCheck, MapPin, Calendar, CreditCard, ChevronRight, User as UserIcon, Activity, RefreshCw } from 'lucide-react';

export default function Cart() {
  const { items, removeFromCart, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const [masterDetails, setMasterDetails] = useState({
    fullName: user?.name || '',
    age: '',
    gender: '',
    phone: user?.phone || '',
    address: '',
    slot: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const groupedItems = items.reduce((acc, item) => {
    const labId = item.labId._id || item.labId;
    if (!acc[labId]) {
      acc[labId] = {
        labDetails: item.labDetails,
        tests: [],
        subTotal: 0
      };
    }
    acc[labId].tests.push(item);
    acc[labId].subTotal += item.discountedPrice;
    return acc;
  }, {});

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!masterDetails.address || !masterDetails.slot) {
      alert('Coordinates and timeline required for dispatch.');
      return;
    }

    setIsProcessing(true);
    try {
      const bookingsPayload = Object.keys(groupedItems).map(labId => ({
        labId,
        testIds: groupedItems[labId].tests.map(t => t._id),
        subTotal: groupedItems[labId].subTotal,
      }));

      const res = await api.post('/bookings/multi', {
        bookings: bookingsPayload,
        totalAmount: getTotalPrice(),
        patientDetails: {
          fullName: masterDetails.fullName,
          age: parseInt(masterDetails.age),
          gender: masterDetails.gender,
          phone: masterDetails.phone,
          address: masterDetails.address
        },
        slot: masterDetails.slot,
      });

      const { bookings, order } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_12345',
        amount: order.amount,
        currency: order.currency,
        name: "HomeTester Bio-Link",
        description: `Protocol Initiation`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post('/bookings/verify-payment', {
              ...response,
              bookingIds: bookings.map(b => b._id)
            });
            clearCart();
            setIsSuccess(true);
          } catch (err) {
            alert('Signal interruption: Payment verification failed');
          }
        },
        prefill: { name: masterDetails.fullName, contact: masterDetails.phone },
        theme: { color: "#06b6d4" }
      };

      if (order.id.startsWith('dummy_order')) {
          await api.post('/bookings/verify-payment', {
            razorpay_order_id: order.id,
            razorpay_payment_id: 'dummy_pay_' + Date.now(),
            razorpay_signature: 'dummy_sig',
            bookingIds: bookings.map(b => b._id)
          });
          clearCart();
          setIsSuccess(true);
          return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Database conflict: Checkout sequence failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-12 max-w-lg">
          <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/20">
            <ShieldCheck className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-black mb-4">Protocol Active</h1>
          <p className="text-slate-500 text-sm mb-10 uppercase tracking-widest leading-loose">The diagnostic request has been successfully injected into the lab matrix.</p>
          <Button onClick={() => navigate('/dashboard')} className="w-full h-14 bg-white text-black font-black rounded-2xl">Enter Bio-Hub</Button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-800 mb-6" />
        <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Cart is Depleted</h2>
        <p className="text-slate-600 text-sm mt-2 mb-8">No diagnostic endpoints selected.</p>
        <Button onClick={() => navigate('/search')} className="bg-white text-black font-black rounded-2xl px-10 h-12">Scan Database</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32 pt-6 px-4 md:px-12 selection:bg-cyan-500/30">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Review Request</h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-6">
          {Object.keys(groupedItems).map(labId => {
            const group = groupedItems[labId];
            return (
              <div key={labId} className="glass-card overflow-hidden">
                <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{group.labDetails?.labName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{group.tests.length} PROTOCOLS</span>
                </div>
                <div className="divide-y divide-white/5">
                  {group.tests.map((item) => (
                    <div key={item._id} className="p-6 flex justify-between items-center group">
                      <div className="space-y-1">
                        <h4 className="font-bold text-lg group-hover:text-cyan-400 transition-colors">{item.testName}</h4>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.category} • {item.reportDeliveryTime}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-black text-lg">₹{item.discountedPrice}</p>
                          <p className="text-[10px] text-slate-500 line-through">₹{item.originalPrice}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-700 hover:text-red-500 transition-colors" onClick={() => removeFromCart(item._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-6 md:p-8 space-y-8 sticky top-24">
            <div className="space-y-1">
              <h3 className="text-lg font-black uppercase tracking-widest">Deployment Matrix</h3>
              <p className="text-xs text-slate-500 font-medium">Verify patient telemetry before injection.</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Legal Full Name" 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                  value={masterDetails.fullName}
                  onChange={e => setMasterDetails({...masterDetails, fullName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Age" 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-6 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                  value={masterDetails.age}
                  onChange={e => setMasterDetails({...masterDetails, age: e.target.value})}
                />
                <select 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-6 text-sm focus:outline-none focus:border-cyan-500/50 transition-all text-slate-400"
                  value={masterDetails.gender}
                  onChange={e => setMasterDetails({...masterDetails, gender: e.target.value})}
                >
                  <option value="" disabled>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Bio-Courier Address" 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                  value={masterDetails.address}
                  onChange={e => setMasterDetails({...masterDetails, address: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Dispatch Window</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    type="datetime-local" 
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all text-slate-400"
                    value={masterDetails.slot}
                    onChange={e => setMasterDetails({...masterDetails, slot: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="flex justify-between items-end mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Total Value</span>
                <span className="text-3xl font-black text-cyan-400">₹{getTotalPrice()}</span>
              </div>
              <Button 
                onClick={handleCheckout} 
                disabled={isProcessing}
                className="w-full h-16 bg-white text-black font-black rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Initialize Payment</>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky Mobile Summary */}
      <div className="md:hidden fixed bottom-[88px] left-4 right-4 z-50">
        <div className="glass-card p-4 flex items-center justify-between border-cyan-500/30">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</p>
            <p className="text-xl font-black text-cyan-400">₹{getTotalPrice()}</p>
          </div>
          <Button onClick={handleCheckout} className="bg-cyan-500 text-black font-black rounded-xl px-8 h-12 shadow-lg shadow-cyan-500/20">Pay</Button>
        </div>
      </div>
    </div>
  );
}

