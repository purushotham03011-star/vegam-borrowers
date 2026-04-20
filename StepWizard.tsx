
import React, { useState, useRef } from 'react';
import { 
  ArrowRight, Check, Loader2, DollarSign, Percent, AlertCircle, 
  Wallet, Smartphone, Laptop, Bike, Car, ShieldCheck, Zap, 
  Upload, User, ChevronLeft, Calendar, X, Mail
} from 'lucide-react';
import { UserProfile, AssetCategory, SubCategory, AssetDetails, ValuationResult, LoanConfig } from '../types';
import { AssetCard } from './AssetCard';
import { assessAssetValue } from '../services/geminiService';
import { registerBorrower, loginBorrower } from '../services/loanService';

// --- Brand Constants ---
const MOBILE_BRANDS = ["Apple", "Google", "iQOO", "Infinix", "itel", "Lava", "Lenovo", "Micromax", "Motorola", "Nokia", "Nothing", "OnePlus", "OPPO", "Poco", "Realme", "Redmi", "Samsung", "Tecno", "Vivo", "Xiaomi"];
const LAPTOP_BRANDS = ["Acer", "Apple", "ASUS", "Dell", "HP", "Infinix", "LG", "Lenovo", "MSI", "Realme", "Samsung", "Tecno", "Xiaomi"];
const BIKE_BRANDS = ["Aprilia", "Bajaj", "BMW Motorrad", "CFMoto", "Ducati", "Harley-Davidson", "Hero MotoCorp", "Honda", "Jawa", "Kawasaki", "Keeway", "KTM", "Moto Morini", "MV Agusta", "Omega (EV)", "Royal Enfield", "Suzuki", "Triumph", "TVS", "Ultraviolette", "Yamaha"];
const CAR_BRANDS = ["Audi", "BMW", "BYD", "Citroën", "Force Motors", "Ford", "Honda", "Hyundai", "Jeep", "Kia", "Lexus", "Mahindra", "Maruti Suzuki", "Mercedes-Benz", "MG", "Nissan", "Renault", "Skoda", "Tata Motors", "Toyota", "Volkswagen", "Volvo"];

// --- Reusable UI Components (Light Mode) ---
const InputField = (props: React.InputHTMLAttributes<HTMLInputElement> & { label: string, list?: string }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-600 mb-2">{props.label}</label>
    <input 
      {...props} 
      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all text-gray-900 placeholder:text-gray-400 shadow-sm text-base"
    />
  </div>
);

const SelectField = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-600 mb-2">{props.label}</label>
    <select 
      {...props}
      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all text-gray-900 shadow-sm text-base bg-white"
    >
      {props.children}
    </select>
  </div>
);

const CheckboxField = ({ label: checkBoxLabel, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${checked ? 'bg-violet-50 border-violet-500' : 'bg-gray-50 border-gray-200 hover:border-gray-400'}`}
  >
    <div className={`w-6 h-6 rounded border flex items-center justify-center mr-3 flex-shrink-0 ${checked ? 'bg-violet-600 border-violet-600' : 'border-gray-400 bg-white'}`}>
      {checked && <Check size={16} className="text-white" />}
    </div>
    <span className={`font-medium ${checked ? 'text-violet-700' : 'text-gray-600'}`}>{checkBoxLabel}</span>
  </div>
);

// --- Success Popup Modal ---
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckStatus: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, onCheckStatus }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-300 relative border border-gray-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center pt-2">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50 shadow-inner">
                <Check className="w-10 h-10 text-green-600" />
             </div>
             <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Request Submitted!</h2>
             <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2">
               Your loan application has been successfully recorded. Our team will verify your details and contact you shortly.
             </p>
             
             <button 
               onClick={onCheckStatus}
               className="w-full bg-violet-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 text-base active:scale-95 mb-3"
             >
               Check Application Status
             </button>

             <button 
               onClick={onClose}
               className="w-full bg-gray-100 text-gray-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-all text-base active:scale-95"
             >
               Back to Dashboard
             </button>
        </div>
      </div>
    </div>
  );
};

// --- Step 1: Login / Sign Up Form ---
export const LoginForm: React.FC<{ onComplete: (profile: UserProfile) => Promise<void> }> = ({ onComplete }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sign Up Fields
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Login Fields
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Name or ID
  const [loginMobile, setLoginMobile] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (name && city && email && mobile.length === 10) {
      setLoading(true);
      try {
        const profile = await registerBorrower({ name, city, email, mobile });
        await onComplete(profile);
      } catch (err: any) {
        setErrorMsg(err.message || "Registration failed. Try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (loginIdentifier && loginMobile.length === 10) {
      setLoading(true);
      try {
        const profile = await loginBorrower(loginIdentifier, loginMobile);
        await onComplete(profile);
      } catch (err: any) {
        setErrorMsg(err.message || "Login failed. Check credentials.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto grid md:grid-cols-2 gap-0 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
      
      {/* Branding Panel */}
      <div className="bg-gradient-to-br from-violet-700 to-purple-800 p-6 md:p-10 text-white flex flex-col justify-between relative order-1 md:order-1">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6 text-white">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <ul className="space-y-4 md:space-y-6 hidden md:block">
            <li className="flex gap-4">
              <div className="bg-white/20 p-2 rounded-lg"><ShieldCheck className="h-6 w-6 text-white"/></div>
              <div>
                <p className="font-bold">Bank Grade Security</p>
                <p className="text-sm text-violet-200">256-bit Encryption for your data.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-white/20 p-2 rounded-lg"><Zap className="h-6 w-6 text-yellow-300"/></div>
              <div>
                <p className="font-bold">Instant KYC</p>
                <p className="text-sm text-violet-200">Paperless verification.</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="text-xs text-violet-300 mt-4 md:mt-10 md:block hidden">By continuing, you agree to our Terms & Privacy Policy.</div>
      </div>

      {/* Form Panel */}
      <div className="p-6 md:p-10 flex flex-col justify-center order-2 md:order-2">
        {/* Toggle Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'signup' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign Up
          </button>
          <button 
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Login
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        {mode === 'signup' ? (
          /* --- SIGN UP FORM --- */
          <form onSubmit={handleSignUp} className="space-y-4">
            <InputField label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required />
            
            <SelectField label="City" value={city} onChange={e => setCity(e.target.value)} required>
               <option value="">Select City</option>
               <option value="Anantapur">Anantapur</option>
               <option value="Vizag">Vizag</option>
               <option value="Bangalore">Bangalore</option>
            </SelectField>

            <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-5 top-4 text-gray-400 font-medium text-base">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  className="w-full pl-14 pr-5 py-3.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none text-gray-900 placeholder:text-gray-400 shadow-sm text-base"
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-violet-200 active:scale-95 text-lg mt-2">
              {loading ? <Loader2 className="animate-spin" /> : <>Sign Up <ArrowRight size={20} /></>}
            </button>
          </form>
        ) : (
          /* --- LOGIN FORM --- */
          <form onSubmit={handleLogin} className="space-y-5">
            <InputField 
              label="Name or Borrower ID" 
              value={loginIdentifier} 
              onChange={e => setLoginIdentifier(e.target.value)} 
              placeholder="e.g. V101 or John Doe" 
              required 
            />

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-5 top-4 text-gray-400 font-medium text-base">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  className="w-full pl-14 pr-5 py-3.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none text-gray-900 placeholder:text-gray-400 shadow-sm text-base"
                  placeholder="98765 43210"
                  value={loginMobile}
                  onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-violet-200 active:scale-95 text-lg mt-2">
              {loading ? <Loader2 className="animate-spin" /> : <>Login <ArrowRight size={20} /></>}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-violet-600 font-bold hover:underline">Sign Up</button></p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// --- Step 2: Asset Selection ---
export const AssetSelectionStep: React.FC<{ onSelect: (cat: AssetCategory, sub: SubCategory) => void, onBack: () => void }> = ({ onSelect, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6 md:mb-8">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 mr-4 transition-colors p-2 -ml-2">
          <ChevronLeft className="h-6 w-6 mr-1" /> Back
        </button>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">New Request</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-10">
        <AssetCard 
          title="Electronics" 
          MainIcon={Smartphone} 
          gradient="bg-gradient-to-br from-violet-600 to-indigo-600" 
          options={[{ label: 'Mobile Phones', value: 'mobile', icon: Smartphone }, { label: 'Laptops', value: 'laptop', icon: Laptop }]} 
          onSelect={(sub) => onSelect('electronics', sub)} 
        />
        <AssetCard 
          title="Vehicles" 
          MainIcon={Car} 
          gradient="bg-gradient-to-br from-orange-500 to-red-500" 
          options={[{ label: 'Two Wheeler', value: 'bike', icon: Bike }, { label: 'Four Wheeler', value: 'car', icon: Car }]} 
          onSelect={(sub) => onSelect('vehicles', sub)} 
        />
      </div>
    </div>
  );
};

// --- Step 3: Detailed Asset Form ---
export const AssetDetailsForm: React.FC<{ 
  initialData: AssetDetails, 
  onValuationComplete: (details: AssetDetails, result: ValuationResult) => void,
  onBack: () => void
}> = ({ initialData, onValuationComplete, onBack }) => {
  const [formData, setFormData] = useState<AssetDetails>(initialData);
  const [loading, setLoading] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof AssetDetails, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await assessAssetValue(formData);
      // Pass file names along with form data
      const finalAssetDetails = { ...formData, photoNames: fileNames };
      onValuationComplete(finalAssetDetails, result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f: File) => f.name);
      setFileNames(names);
    }
  };

  const getBrandList = () => {
    switch (formData.subCategory) {
      case 'mobile': return MOBILE_BRANDS;
      case 'laptop': return LAPTOP_BRANDS;
      case 'bike': return BIKE_BRANDS;
      case 'car': return CAR_BRANDS;
      default: return [];
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100">
      <div className="flex items-center gap-4 mb-6 md:mb-8 pb-6 border-b border-gray-100">
         <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2">
          <ChevronLeft className="h-6 w-6 text-gray-500" />
        </button>
        <div className="bg-violet-50 p-3 rounded-xl text-violet-600">
          {formData.category === 'electronics' ? <Smartphone size={24}/> : <Car size={24}/>}
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900">Asset Details</h2>
          <p className="text-gray-500 text-xs md:text-sm">Provide details for valuation.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mobile: 1 Col, Desktop: 2 Col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField 
            label={formData.category === 'vehicles' ? "Make/Brand" : "Brand"} 
            value={formData.brand || ''} 
            onChange={e => update('brand', e.target.value)} 
            required
          >
            <option value="">Select Brand</option>
            {getBrandList().map(b => <option key={b} value={b}>{b}</option>)}
          </SelectField>
          <InputField label="Model" value={formData.model || ''} onChange={e => update('model', e.target.value)} placeholder="e.g. iPhone 14, City" required />
        </div>

        {formData.category === 'electronics' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField label="Storage" value={formData.storage || ''} onChange={e => update('storage', e.target.value)} required>
                <option value="">Select Storage</option>
                <option>64 GB</option><option>128 GB</option><option>256 GB</option><option>512 GB</option><option>1 TB</option>
              </SelectField>
              <SelectField label="RAM" value={formData.ram || ''} onChange={e => update('ram', e.target.value)} required>
                 <option value="">Select RAM</option>
                 <option>4 GB</option><option>8 GB</option><option>16 GB</option><option>32 GB</option>
              </SelectField>
            </div>
            <SelectField label="Condition" value={formData.condition || ''} onChange={e => update('condition', e.target.value)} required>
              <option value="">Select Condition</option>
              <option value="New">Brand New (Sealed)</option>
              <option value="Like New">Like New (Flawless)</option>
              <option value="Good">Good (Minor Scratches)</option>
              <option value="Average">Average (Visible Wear)</option>
            </SelectField>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Year of Registration" type="number" value={formData.year || ''} onChange={e => update('year', e.target.value)} placeholder="2020" required />
              <InputField label={formData.subCategory === 'bike' ? "Engine (CC)" : "Driven (Km)"} value={formData.subCategory === 'bike' ? formData.engineCC : formData.mileage} onChange={e => formData.subCategory === 'bike' ? update('engineCC', e.target.value) : update('mileage', e.target.value)} required />
            </div>
            <SelectField label="Fuel Type" value={formData.fuelType || ''} onChange={e => update('fuelType', e.target.value)} required>
              <option value="">Select Fuel</option>
              <option>Petrol</option><option>Diesel</option><option>Electric</option><option>CNG</option>
            </SelectField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <CheckboxField label="RC Available" checked={!!formData.hasRC} onChange={v => update('hasRC', v)} />
              <CheckboxField label="Valid Insurance" checked={!!formData.hasInsurance} onChange={v => update('hasInsurance', v)} />
            </div>
          </>
        )}

        <div 
          onClick={() => {
             if (fileInputRef.current) {
                fileInputRef.current.value = ''; 
                fileInputRef.current.click();
             }
          }}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${fileNames.length > 0 ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:bg-gray-50'}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />
          <Upload className={`mx-auto h-8 w-8 mb-2 ${fileNames.length > 0 ? 'text-violet-500' : 'text-gray-400'}`} />
          {fileNames.length > 0 ? (
             <div className="text-sm text-violet-600 font-bold">
               {fileNames.length} file(s) selected:
               <div className="font-normal text-xs mt-1 text-violet-400 truncate px-4">{fileNames.join(', ')}</div>
             </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 font-medium">Upload Photos</p>
              <p className="text-xs text-gray-400 mt-1">Front, Back, Accessories</p>
            </>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-violet-600 text-white py-4 rounded-xl font-bold hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-200 active:scale-95 text-lg">
          {loading ? <Loader2 className="animate-spin" /> : 'Check Eligibility'}
        </button>
      </form>
    </div>
  );
};

// --- Step 4: Loan Calculator ---
export const LoanCalculatorStep: React.FC<{
  valuation: ValuationResult,
  onConfirm: (config: LoanConfig, total: number) => void,
  onBack: () => void
}> = ({ valuation, onConfirm, onBack }) => {
  const [amount, setAmount] = useState(Math.floor(valuation.maxLoanAmount * 0.8));
  const [durationVal, setDurationVal] = useState<string>('6');
  const [durationUnit, setDurationUnit] = useState<'weeks'|'months'|'years'>('months');
  const [interestRate, setInterestRate] = useState<number>(12); 
  
  // FIXED PLATFORM FEE as per requirement
  const platformFee = 100;
  
  const getDurationInYears = () => {
    const val = parseFloat(durationVal) || 0;
    if (durationUnit === 'weeks') return val / 52;
    if (durationUnit === 'months') return val / 12;
    return val;
  };
  
  const interestAmount = Math.floor(amount * (interestRate / 100) * getDurationInYears());
  const totalRepayment = amount + interestAmount + platformFee;

  const handleSubmit = () => {
    const val = parseFloat(durationVal) || 0;
    if (val <= 0) return;

    onConfirm({
      requestedAmount: amount,
      interestRate,
      durationValue: val,
      durationUnit
    }, totalRepayment);
  };

  if (!valuation.isEligible) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 inline-block mb-6">
           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
           <h3 className="text-xl font-bold text-red-700">Application Declined</h3>
           <p className="text-red-500 mt-2">{valuation.message}</p>
        </div>
        <button onClick={onBack} className="text-gray-500 hover:text-gray-900 font-medium p-4">Back to details</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors p-2 -ml-2">
          <ChevronLeft className="h-6 w-6 mr-1" /> Back
        </button>
      </div>

      {/* Valuation Summary Card */}
      <div className="bg-gradient-to-r from-violet-600 to-orange-500 p-6 md:p-8 rounded-[2rem] text-white shadow-xl mb-6 md:mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 relative z-10">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Check className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="font-bold font-serif text-2xl mb-1">Eligible for Loan</h3>
            <p className="text-violet-100 text-sm mb-4 md:mb-3">{valuation.message}</p>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center bg-black/10 px-3 py-2 rounded-lg border border-white/10">
                <span className="text-xs md:text-sm text-violet-100 mr-2">Max Limit:</span>
                <span className="font-bold text-lg md:text-xl">₹{valuation.maxLoanAmount.toLocaleString()}</span>
              </div>
              <div className="inline-flex items-center bg-black/10 px-3 py-2 rounded-lg border border-white/10">
                 <span className="text-xs md:text-sm text-violet-100 mr-2">Est. Value:</span>
                 <span className="font-bold text-lg md:text-xl">₹{valuation.estimatedValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-[2rem] p-6 md:p-10 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 md:mb-8">Customize Plan</h2>
        
        <div className="space-y-8">
          {/* Amount Slider & Input */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="text-sm font-semibold text-gray-600">Loan Amount</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <span className="text-gray-500 mr-1">₹</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    max={valuation.maxLoanAmount}
                    className="w-24 text-right bg-transparent outline-none font-bold text-gray-900 text-lg"
                  />
              </div>
            </div>
            {/* Touch Friendly Slider */}
            <input 
              type="range" 
              min={1000} 
              max={valuation.maxLoanAmount} 
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600 hover:accent-violet-500 transition-all"
            />
            <div className="flex justify-between text-xs font-medium text-gray-400 mt-2">
              <span>₹1,000</span>
              <span>₹{valuation.maxLoanAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
               <label className="block text-sm font-semibold text-gray-500 mb-3">Duration</label>
               <div className="flex gap-2">
                 <input 
                  type="number" 
                  min="1" 
                  value={durationVal}
                  onChange={(e) => setDurationVal(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 bg-white outline-none font-semibold text-gray-900 text-lg"
                 />
                 <select 
                  value={durationUnit} 
                  onChange={(e) => setDurationUnit(e.target.value as any)}
                  className="p-3 rounded-lg border border-gray-200 bg-white outline-none font-semibold text-gray-900 text-base"
                 >
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                 </select>
               </div>
            </div>

            {/* Interest Rate */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
               <label className="block text-sm font-semibold text-gray-500 mb-3">Interest Rate (% p.a.)</label>
               <input 
                  type="number" 
                  min="0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full p-3 rounded-lg border border-gray-200 bg-white outline-none font-semibold text-gray-900 text-lg"
               />
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
            {/* REMOVED Interest Cost Display Row */}
            <div className="flex justify-between text-sm text-gray-600">
              <span className="flex items-center gap-2"><Wallet className="h-4 w-4 text-violet-500" /> Platform Fees</span>
              <span className="font-semibold text-gray-800">₹{platformFee.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Repayment</span>
              <span className="font-bold text-2xl text-violet-600">₹{totalRepayment.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 italic text-center px-4">
            Note:- The calculated amounts are provided only as estimations. Actual loan terms may be adjusted and finalized by the lender during approval.
          </p>

          <button 
            onClick={handleSubmit}
            className="w-full bg-violet-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-violet-700 transition-all shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95"
          >
            Submit Application <ArrowRight size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
};
