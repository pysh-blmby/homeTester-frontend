import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, FileCheck, Stethoscope, Landmark, ArrowRight, ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';
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
    { id: 1, title: 'Basic Details', icon: Building2 },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Certifications', icon: FileCheck },
    { id: 4, title: 'Operations', icon: Stethoscope },
    { id: 5, title: 'Payout', icon: Landmark }
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

  const InputField = ({ label, placeholder, type = 'text' }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <Input type={type} placeholder={placeholder} className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus:border-cyan-500" required />
    </div>
  );

  const FileUpload = ({ label }) => (
    <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 hover:border-cyan-500/50 transition-colors cursor-pointer group">
      <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <UploadCloud className="w-6 h-6 text-cyan-400" />
      </div>
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      <p className="text-xs text-slate-500">PDF, JPG up to 10MB</p>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-black/60 border border-white/10 p-8 rounded-3xl text-center backdrop-blur-xl">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Application Submitted</h2>
          <p className="text-slate-400 mb-8">Your lab profile is now in pending status. Our operations team will verify your NABL certificates and activate your listing within 48 hours.</p>
          <Button className="w-full bg-white text-black hover:bg-slate-200 rounded-xl font-bold">Return to Homepage</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-10 pb-20 px-4 flex justify-center selection:bg-cyan-500/30 relative overflow-hidden">
      {/* Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Partner With Us</h1>
          <p className="text-slate-400 text-lg">Join India's smartest diagnostic network.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Progress Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 space-y-2">
              {steps.map((s) => (
                <div key={s.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${step === s.id ? 'bg-white/10 border border-white/10' : step > s.id ? 'text-emerald-400' : 'text-slate-600'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step === s.id ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : step > s.id ? 'border-emerald-400 bg-emerald-400/10' : 'border-slate-700'}`}>
                    {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className="font-semibold text-sm">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 bg-black/60 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <motion.div className="h-full bg-cyan-500" initial={{ width: 0 }} animate={{ width: `${(step / 5) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>

            <form onSubmit={handleNext} className="space-y-6">
              
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Basic Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField label="Lab Registered Name" placeholder="e.g. Apollo Diagnostics" value={formData.labName} onChange={(e) => setFormData({...formData, labName: e.target.value})} />
                      <InputField label="Owner Full Name" placeholder="Dr. John Doe" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} />
                      <InputField label="Official Email" type="email" placeholder="contact@lab.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      <InputField label="Primary Phone" type="tel" placeholder="9876543210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      <InputField label="GST Number (Optional)" placeholder="22AAAAA0000A1Z5" />
                      <InputField label="Years of Experience" type="number" placeholder="e.g. 15" />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Location Coordinates</h2>
                    <InputField label="Complete Street Address" placeholder="123 Health Avenue, Sector 4" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField label="City" placeholder="Mumbai" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                      <InputField label="State" placeholder="Maharashtra" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
                      <InputField label="Pincode" placeholder="400001" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
                      <InputField label="Landmark" placeholder="Near Metro Station" />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Compliance & Certifications</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FileUpload label="NABL Certificate" />
                      <FileUpload label="Trade License" />
                      <FileUpload label="Bio-Waste Approval" />
                      <FileUpload label="Lab Logo" />
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Operational Parameters</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField label="Operating Hours" placeholder="e.g. 08:00 AM - 08:00 PM" />
                      <InputField label="Number of Technicians" type="number" placeholder="5" />
                      <InputField label="Home Collection Radius (KM)" type="number" placeholder="10" />
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Payout Infrastructure</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField label="Account Holder Name" placeholder="As per bank records" />
                      <InputField label="Bank Name" placeholder="e.g. HDFC Bank" />
                      <InputField label="Account Number" placeholder="000000000000" />
                      <InputField label="IFSC Code" placeholder="HDFC0000001" />
                      <div className="col-span-full">
                        <InputField label="UPI ID (Optional)" placeholder="lab@okhdfc" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between pt-8 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1} className="text-slate-400 hover:text-white rounded-xl">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold px-8 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  {step === 5 ? (isSubmitting ? 'Submitting...' : 'Submit Application') : 'Continue'} {step !== 5 && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
