import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, FileCheck, Stethoscope, Landmark, ArrowRight, ArrowLeft, UploadCloud, CheckCircle2, ShieldCheck, Info, Mail, Phone, Clock, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function LabOnboarding() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    labName: '', ownerName: '', phone: '', email: '', description: '',
    address: '', city: '', state: '', pincode: '',
    openTime: '09:00 AM', closeTime: '07:00 PM', radius: 10
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: Building2 },
    { id: 2, title: 'Location Details', icon: MapPin },
    { id: 3, title: 'Compliance & Docs', icon: FileCheck },
    { id: 4, title: 'Service Reach', icon: Stethoscope },
    { id: 5, title: 'Financial Setup', icon: Landmark }
  ];

  const handleNext = async (e) => {
    e.preventDefault();
    if (step < 5) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        await api.post('/labs/apply', {
          labName: formData.labName,
          ownerName: formData.ownerName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          description: formData.description,
          operatingTimings: { open: formData.openTime, close: formData.closeTime }
        });
        setIsSubmitted(true);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to submit application');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const InputField = ({ label, placeholder, type = 'text', value, onChange }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <Input 
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 h-14 rounded-2xl focus:border-blue-600/30 focus:bg-white transition-all shadow-sm" 
        required 
      />
    </div>
  );

  const FileUpload = ({ label }) => (
    <div className="border-2 border-dashed border-slate-100 rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50/50 hover:border-blue-600/30 transition-all cursor-pointer group bg-white shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
        <UploadCloud className="w-7 h-7 text-blue-600" />
      </div>
      <p className="text-sm font-bold text-slate-700 mb-1">{label}</p>
      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">PDF, JPG up to 10MB</p>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full bg-white border border-slate-100 p-12 md:p-16 rounded-[3rem] text-center shadow-[0_30px_60px_rgba(0,0,0,0.05)]">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Application Received</h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Thank you for your interest in joining our network. Our accreditation team will verify your NABL certifications and documents. You will receive an update on your primary contact number within 48-72 hours.
          </p>
          <div className="bg-slate-50 rounded-2xl p-6 mb-10 text-left space-y-3 border border-slate-100">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
              <ShieldCheck size={18} className="text-blue-600" /> Verification Pending
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
              <Mail size={18} className="text-blue-600" /> Confirmation email sent
            </div>
          </div>
          <Button className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold shadow-xl transition-all" onClick={() => window.location.href = '/'}>
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pt-10 pb-24 px-4 md:px-12 flex justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] pointer-events-none opacity-60" />

      <div className="w-full max-w-6xl relative z-10">
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100">
            <ShieldCheck size={14} /> Provider Partnership Program
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">Partner With Us</h1>
          <p className="text-slate-500 text-sm md:text-xl font-medium max-w-2xl mx-auto">
            Join the fastest-growing diagnostic aggregator network in India. Scale your laboratory business with our technology-first approach.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Progress Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-32 space-y-3">
              {steps.map((s) => (
                <div 
                  key={s.id} 
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all ${step === s.id ? 'bg-white shadow-md border border-slate-100 text-blue-600' : 'text-slate-400'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                    step === s.id ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm shadow-blue-600/10' : 
                    step > s.id ? 'border-emerald-500 bg-emerald-50 text-emerald-500' : 
                    'border-slate-100 bg-slate-50'
                  }`}>
                    {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Step 0{s.id}</span>
                    <span className="font-bold text-sm tracking-tight">{s.title}</span>
                  </div>
                </div>
              ))}

              <div className="mt-12 p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <Info size={24} className="mb-4 opacity-80" />
                <h4 className="font-bold text-lg mb-2">Need Assistance?</h4>
                <p className="text-xs text-blue-100 font-medium mb-6 leading-relaxed">Our partner support team is available 24/7 to help you with the onboarding process.</p>
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-blue-600 font-bold h-11 rounded-xl">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 bg-white border border-slate-100 rounded-[3rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
              <motion.div 
                className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                initial={{ width: 0 }} 
                animate={{ width: `${(step / 5) * 100}%` }} 
                transition={{ duration: 0.5, ease: 'easeOut' }} 
              />
            </div>

            <form onSubmit={handleNext} className="space-y-10">
              
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Basic Information</h2>
                      <p className="text-slate-400 text-sm font-medium">Tell us about your laboratory and management.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <InputField label="Lab Registered Name" placeholder="e.g. Apollo Diagnostics" value={formData.labName} onChange={(e) => setFormData({...formData, labName: e.target.value})} />
                      <InputField label="Owner Full Name" placeholder="Dr. John Doe" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} />
                      <InputField label="Official Business Email" type="email" placeholder="contact@lab.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      <InputField label="Primary Phone Number" type="tel" placeholder="9876543210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      <InputField label="GST Number (Optional)" placeholder="22AAAAA0000A1Z5" />
                      <InputField label="Operational Since (Year)" type="number" placeholder="e.g. 2010" />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Location Details</h2>
                      <p className="text-slate-400 text-sm font-medium">Provide the physical location of your primary center.</p>
                    </div>
                    <InputField label="Complete Street Address" placeholder="123 Health Avenue, Sector 4" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                    <div className="grid md:grid-cols-2 gap-8">
                      <InputField label="City" placeholder="Mumbai" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                      <InputField label="State" placeholder="Maharashtra" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
                      <InputField label="Pincode" placeholder="400001" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
                      <InputField label="Nearest Landmark" placeholder="Near Metro Station" />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Compliance & Docs</h2>
                      <p className="text-slate-400 text-sm font-medium">Upload mandatory certifications for verification.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <FileUpload label="NABL Certificate" />
                      <FileUpload label="Trade License" />
                      <FileUpload label="Bio-Waste Approval" />
                      <FileUpload label="Center Photos" />
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Operational Reach</h2>
                      <p className="text-slate-400 text-sm font-medium">Define your service capacity and availability.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Opening Time</label>
                        <div className="relative">
                          <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input type="time" className="bg-slate-50 border-slate-100 h-14 pl-14 rounded-2xl" value={formData.openTime} onChange={(e) => setFormData({...formData, openTime: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Closing Time</label>
                        <div className="relative">
                          <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input type="time" className="bg-slate-50 border-slate-100 h-14 pl-14 rounded-2xl" value={formData.closeTime} onChange={(e) => setFormData({...formData, closeTime: e.target.value})} />
                        </div>
                      </div>
                      <InputField label="Home Collection Fleet Size" type="number" placeholder="5" />
                      <InputField label="Service Radius (KM)" type="number" placeholder="10" />
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Infrastructure</h2>
                      <p className="text-slate-400 text-sm font-medium">Setup your automated payout settlements.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <InputField label="Beneficiary Name" placeholder="As per bank records" />
                      <InputField label="Bank Name" placeholder="e.g. HDFC Bank" />
                      <InputField label="Account Number" placeholder="000000000000" />
                      <InputField label="Bank IFSC Code" placeholder="HDFC0000001" />
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                      <Target className="text-blue-600 mt-1 shrink-0" size={20} />
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        By submitting, you agree to our Platform Terms of Service and Revenue Share protocols. Payouts are settled every T+2 business days.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center pt-10 border-t border-slate-50">
                <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1} className="h-14 px-8 text-slate-400 hover:text-slate-900 rounded-2xl font-bold transition-all disabled:opacity-30">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="h-14 px-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/10 transition-all flex items-center gap-2">
                  {step === 5 ? (isSubmitting ? 'Processing...' : 'Submit Partnership Application') : 'Continue Registration'} {step !== 5 && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
