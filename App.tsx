
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LegalPage } from './components/LegalPage';
import { LoginForm, AssetSelectionStep, AssetDetailsForm, LoanCalculatorStep, SuccessModal } from './components/StepWizard';
import { ApplicationStatus } from './components/ApplicationStatus';
import { FAQSection } from './components/FAQSection';
import { LocationsSection } from './components/LocationsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { RadarScanner } from './components/RadarScanner';
import { AppStep, AssetCategory, SubCategory, UserProfile, AssetDetails, ValuationResult, LoanConfig } from './types';
// Import Supabase Service
import { submitLoanApplication } from './services/loanService';
import { 
  CheckCircle, ArrowRight, FileText, Plus, HelpCircle, 
  User, List, Calculator, Send, Smartphone, Car, Layout, Zap, XCircle, Bike, Laptop
} from 'lucide-react';

// --- Splash Screen Component ---
const SplashScreen = () => {
  // Define Logo SVG locally for the Splash Screen animations
  const LogoSVG = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 12 L44 32 L4 52 L16 32 Z" fill="#2DD4BF" opacity="0.9" transform="translate(-2, 2)"/>
      <path d="M10 10 L54 32 L10 54 L24 32 Z" fill="#99F6E4" stroke="#1F2937" strokeWidth="5" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Floating Elements Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Rupees */}
        <div className="absolute top-[15%] left-[10%] animate-bounce duration-[3000ms] text-5xl font-bold text-orange-400 opacity-40">₹</div>
        <div className="absolute bottom-[20%] right-[10%] animate-bounce duration-[4000ms] delay-700 text-7xl font-bold text-violet-400 opacity-20">₹</div>
        <div className="absolute top-[45%] left-[5%] animate-pulse duration-[2000ms] text-4xl font-bold text-yellow-500 opacity-30">₹</div>
        <div className="absolute top-[60%] right-[30%] animate-pulse duration-[3000ms] text-6xl font-bold text-blue-400 opacity-20">₹</div>

        {/* Floating Company Logos */}
        <div className="absolute top-[10%] right-[20%] animate-bounce duration-[3500ms] w-16 h-16 opacity-30">
           <LogoSVG className="w-full h-full" />
        </div>
        <div className="absolute bottom-[15%] left-[25%] animate-pulse duration-[3000ms] w-24 h-24 opacity-20">
           <LogoSVG className="w-full h-full" />
        </div>
        <div className="absolute top-[70%] left-[80%] animate-bounce duration-[4500ms] delay-1000 w-12 h-12 opacity-25">
           <LogoSVG className="w-full h-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 fade-in duration-700 p-4 text-center">
        <div className="w-32 h-32 mb-8 relative">
           {/* Glow Effect */}
           <div className="absolute inset-0 bg-teal-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>
           <LogoSVG className="w-full h-full drop-shadow-2xl relative z-10" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-8 tracking-tight drop-shadow-sm">
          Vegam Borrowers
        </h1>
        
        {/* Graphical Welcome Banner */}
        <div className="group relative inline-block mb-12">
          {/* Animated Gradient Border/Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-orange-400 to-teal-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-white ring-1 ring-gray-100 rounded-xl px-8 py-5 shadow-2xl">
             <span className="text-2xl md:text-3xl font-serif italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-orange-500 tracking-wide">
               Welcome for a right step
             </span>
             {/* Decorative Element */}
             <div className="h-1.5 w-16 bg-gradient-to-r from-violet-500 to-orange-400 mx-auto mt-3 rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Loading Bar - 2 Seconds */}
        <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
           <div 
             className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-600 via-orange-500 to-violet-600 rounded-full" 
             style={{ animation: 'progress 2s linear forwards' }}
           ></div>
        </div>
        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
};

// --- Dashboard Component (Light Theme + Purple/Orange) ---
const Dashboard: React.FC<{ 
  user: UserProfile, 
  onNewLoan: () => void,
  onCheckStatus: () => void 
}> = ({ user, onNewLoan, onCheckStatus }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-[2rem] p-6 md:p-8 text-white mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 w-full">
          <div className="flex justify-between items-start w-full">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">Hello, {user.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-violet-100 text-sm">
                 {/* ID formatted in subtext as well */}
                 <span>{user.displayId ? `Id-${user.displayId}` : 'ID: --'}</span>
                 <span className="hidden md:inline w-1 h-1 bg-violet-300 rounded-full"></span>
                 <span>+91 {user.mobile}</span>
                 <span className="hidden md:inline w-1 h-1 bg-violet-300 rounded-full"></span>
                 <span>{user.city}</span>
              </div>
            </div>
            
            {/* Floating Display ID Badge - Right Side */}
            {user.displayId && (
              <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 shadow-lg flex flex-col items-center justify-center min-w-[100px]">
                 <span className="text-[10px] text-violet-100 uppercase tracking-widest font-bold mb-0.5">Borrower ID</span>
                 <span className="text-xl font-mono font-bold text-white tracking-wide">
                   Id-{user.displayId}
                 </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText size={20} className="text-violet-600"/> Loan Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 border border-violet-100">
                  <Plus size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">New Application</h3>
              <p className="text-gray-500 mb-6 text-sm">Get a loan against your assets instantly.</p>
              <button onClick={onNewLoan} className="w-full bg-violet-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 active:scale-95">
                Apply Now
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500 border border-orange-100">
                  <FileText size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">My Applications</h3>
              <p className="text-gray-500 mb-6 text-sm">Check status of previous requests.</p>
              <button onClick={onCheckStatus} className="w-full bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95">
                Check Status
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-md">
             <h3 className="font-bold text-violet-600 mb-4 flex items-center gap-2"><HelpCircle size={18}/> Need Help?</h3>
             <ul className="space-y-4 text-sm text-gray-600">
               <li className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"><span>Support</span> <span className="font-semibold text-gray-900">+91 800-123-4567</span></li>
               <li className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"><span>Email</span> <span className="font-semibold text-gray-900">help@vegam.com</span></li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Landing Page ---
const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="animate-in fade-in duration-700 bg-white overflow-x-hidden">
    {/* Hero Section */}
    <div id="hero" className="relative overflow-hidden pt-8 pb-12 lg:pt-20 lg:pb-24">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-violet-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-orange-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
        <div className="lg:w-1/2 text-center lg:text-left z-10 order-1 lg:order-1">
          <div className="inline-block px-4 py-1.5 rounded-full bg-violet-50 text-violet-700 font-semibold text-xs md:text-sm mb-4 md:mb-6 border border-violet-100">
            Real-time Collateral Loans
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold tracking-tight text-gray-900 mb-4 md:mb-6 leading-tight">
            Confidence in <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-orange-500">
              Value.
            </span>
          </h1>
          <p className="mt-2 md:mt-4 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-2 lg:px-0">
            Vegam Borrowers provides a transparent lending platform powered by AI-driven, real-time asset valuation.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full md:w-auto">
            <button 
              onClick={onStart}
              className="w-full md:w-auto px-8 py-4 rounded-full text-lg font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all transform hover:-translate-y-1 flex items-center justify-center shadow-xl shadow-violet-200 active:scale-95"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="lg:w-1/2 relative flex justify-center lg:justify-end order-2 lg:order-2 w-full">
          <div className="relative w-full max-w-md mx-auto lg:mx-0">
            
            {/* White Rounded Shape Background */}
            <div className="bg-gray-50 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 h-[400px] md:h-[500px] flex items-end justify-center border-4 border-white">
               <img 
                 src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Happy Borrower"
                 className="w-full h-full object-cover object-center"
                 referrerPolicy="no-referrer"
               />
            </div>

            {/* Floating 'Loan Approved' Card */}
            <div className="absolute bottom-6 right-2 sm:-right-8 z-20 w-56 sm:w-64">
               <div className="bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-sm bg-opacity-95 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                     <div className="text-violet-700 font-bold bg-violet-50 px-3 py-1 rounded-full text-xs border border-violet-100">
                       Loan Approved
                     </div>
                     <CheckCircle className="h-5 w-5 text-violet-500" />
                  </div>
                  
                  <div className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Disbursed Amount</div>
                  <div className="text-3xl font-bold text-gray-900 mb-4">₹45,000</div>
                  
                  {/* Progress Bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-violet-600 to-orange-400 w-full animate-[shimmer_2s_infinite]"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    {/* Asset Estimation Framework Section */}
    <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">Asset Estimation</h2>
        <p className="text-gray-500 text-base md:text-lg mb-8 md:mb-12">AI-Powered Valuation Model for Lenders & Borrowers</p>
        
        <h3 className="text-lg font-bold text-gray-800 mb-6">Assets We Support</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {[
            { icon: Car, label: "Cars", color: "text-orange-500", bg: "bg-white hover:border-orange-200" },
            { icon: Bike, label: "Bikes", color: "text-violet-500", bg: "bg-white hover:border-violet-200" },
            { icon: Laptop, label: "Laptops", color: "text-orange-500", bg: "bg-white hover:border-orange-200" },
            { icon: Smartphone, label: "Mobiles", color: "text-violet-500", bg: "bg-white hover:border-violet-200" }
          ].map((item, i) => (
            <div key={i} className={`p-6 md:p-8 rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.bg}`}>
              <div className={`p-3 md:p-4 bg-gray-50 rounded-full mb-3 md:mb-4`}>
                <item.icon className={`h-6 w-6 md:h-8 md:w-8 ${item.color}`} />
              </div>
              <span className="font-bold text-gray-800 text-base md:text-lg">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* About Section */}
    <section id="about" className="py-16 md:py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">About Vegam</h2>
          <div className="w-20 h-1.5 bg-violet-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed space-y-6 text-center">
          <p>
            Vegam Borrowers connects borrowers with lenders securely. We do not lend money directly but provide the technology framework for instant asset valuation and secure processing.
          </p>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-12 text-left">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-100">
               <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-4 text-violet-600">Our Goal</h3>
               <ul className="space-y-3 text-gray-600 text-sm md:text-base">
                 <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0"/> Quick and hassle-free borrowing</li>
                 <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0"/> Clear product-based eligibility</li>
                 <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0"/> Transparent loan calculations</li>
                 <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0"/> Safe and secure communication</li>
               </ul>
            </div>
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-6 md:p-8 rounded-xl shadow-xl text-white flex flex-col justify-center">
               <p className="text-lg md:text-xl italic font-serif font-medium leading-relaxed">
                 "Whether you need money for emergencies or personal use, Vegam Borrowers offers a smarter, digital-first bridge to access funds."
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Collateral Loan Explanation with Rupee Image */}
    <section className="py-12 md:py-24 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Changed layout from col to row on mobile for side-by-side effect */}
        <div className="flex flex-row lg:flex-row items-center gap-4 md:gap-16">
          
          {/* 3D Rupee Coin Image - Reordered to be first (Left) on mobile */}
          {/* Reduced size significantly for mobile: w-24 h-24 */}
          <div className="w-1/3 lg:w-1/2 flex justify-center items-center">
             <div className="relative w-24 h-24 sm:w-80 sm:h-80 md:w-96 md:h-96 group">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-orange-400 rounded-full blur-[30px] md:blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                
                {/* SVG Coin */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700 ease-in-out">
                  <defs>
                    <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FBBF24" /> {/* Amber 400 */}
                      <stop offset="45%" stopColor="#F59E0B" /> {/* Amber 500 */}
                      <stop offset="100%" stopColor="#EA580C" /> {/* Orange 600 */}
                    </linearGradient>
                    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="100%" stopColor="#B45309" />
                    </linearGradient>
                    <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#FEF3C7" />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer Rim */}
                  <circle cx="100" cy="100" r="95" fill="url(#rimGrad)" />
                  <circle cx="100" cy="100" r="90" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="1" />
                  
                  {/* Inner Decorative Circle */}
                  <circle cx="100" cy="100" r="75" fill="none" stroke="#FDE68A" strokeWidth="2" opacity="0.6" strokeDasharray="8 4" />
                  
                  {/* Rupee Symbol */}
                  <text x="100" y="145" fontSize="130" fontWeight="800" fill="url(#textGrad)" textAnchor="middle" fontFamily="sans-serif" style={{filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'}}>₹</text>
                  
                  {/* Shine Effect */}
                  <ellipse cx="60" cy="50" rx="30" ry="15" transform="rotate(-45 60 50)" fill="white" fillOpacity="0.3" />
                </svg>
             </div>
          </div>

          {/* Text Content - Right side on mobile */}
          <div className="w-2/3 lg:w-1/2">
            <h3 className="text-xl md:text-3xl font-serif font-bold text-gray-900 mb-3 md:mb-8 relative inline-block">
              Understanding Collateral Loans
              <span className="absolute -bottom-2 left-0 w-2/3 h-1 bg-orange-500 rounded-full"></span>
            </h3>
            
            <div className="text-xs md:text-lg text-gray-600 leading-relaxed space-y-2 md:space-y-6 text-justify">
              <p>
                A loan against collateral is a secured loan where a borrower pledges/mortgage an asset to obtain funds from a lender.
              </p>
              <div className="hidden md:block bg-white p-4 md:p-6 rounded-xl border-l-4 border-orange-500 shadow-sm">
                <p className="italic text-gray-700 text-sm md:text-base">
                  "If the borrower defaults, the lender has the right to seize and sell the collateral to recover the outstanding loan amount."
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section id="how-it-works" className="py-16 md:py-20 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-500">Step-by-Step Procedure</p>
        </div>

        {/* 
            Update Grid Layout:
            Mobile: grid-cols-3 (3 items in a row)
            Desktop: grid-cols-3 (remains same or adaptive)
            "3 below 3" means 3 columns, 2 rows.
        */}
        <div className="grid gap-2 md:gap-8 grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              icon: User, 
              title: "1. Login", 
              desc: "Enter your name and mobile." 
            },
            { 
              icon: List, 
              title: "2. Category", 
              desc: "Choose Electronics or Vehicles." 
            },
            { 
              icon: FileText, 
              title: "3. Details", 
              desc: "Provide Brand & Model details." 
            },
            { 
              icon: Calculator, 
              title: "4. Loan", 
              desc: "Fill in amount and duration." 
            },
            { 
              icon: CheckCircle, 
              title: "5. Check", 
              desc: "We check eligibility." 
            },
            { 
              icon: Send, 
              title: "6. Submit", 
              desc: "Request sent to lender." 
            },
          ].map((step, idx) => (
            <div key={idx} className="bg-white p-2 md:p-8 rounded-lg md:rounded-xl border border-gray-100 hover:border-violet-200 hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-8 h-8 md:w-14 md:h-14 bg-violet-50 rounded-lg flex items-center justify-center mb-2 md:mb-6 text-violet-600 shadow-sm group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <step.icon className="w-4 h-4 md:w-7 md:h-7" />
              </div>
              <h3 className="text-xs md:text-xl font-bold text-gray-900 mb-1 md:mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-tight text-[10px] md:text-base hidden md:block">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Our Role / Digital Bridge Section - UPDATED TO LIGHT THEME */}
    <section className="py-16 md:py-24 bg-white relative overflow-hidden border-t border-gray-100">
      {/* Ambient Gradients matching app theme */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none -ml-32 -mb-32"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
           <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Our Role: Your Digital Bridge</h2>
           <div className="w-24 h-1.5 bg-gradient-to-r from-violet-600 to-orange-500 mx-auto rounded-full"></div>
        </div>

        <p className="text-gray-600 text-lg text-center mb-12 max-w-2xl mx-auto leading-relaxed">
          To ensure full transparency, it's important to understand our role. <span className="text-gray-900 font-semibold">Vegam Loans</span> is the technology platform that connects borrowers with lenders.
        </p>

        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-2xl space-y-8">
           {/* Negative Statement */}
           <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
              <div className="flex-shrink-0 p-3 bg-red-50 rounded-full border border-red-100 shadow-sm">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="text-xl text-gray-900 font-medium">
                  We do <span className="text-red-500 font-bold border-b-2 border-red-200 pb-0.5">not</span> lend money, decide interest rates, or take on credit risk.
                </p>
                <p className="text-gray-500 text-sm mt-2">We simply provide the tech infrastructure.</p>
              </div>
           </div>

           {/* Divider with gradient */}
           <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

           {/* Positive Statement */}
           <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
              <div className="flex-shrink-0 p-3 bg-teal-50 rounded-full border border-teal-100 shadow-sm">
                <CheckCircle className="w-8 h-8 text-teal-500" />
              </div>
              <div>
                <p className="text-xl text-gray-900 font-medium">
                   We enable the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-violet-500 font-bold">digital journey</span> between borrower and lender.
                </p>
                <p className="text-gray-500 mt-2 font-medium">
                  Securely &bull; Compliantly &bull; Intelligently
                </p>
              </div>
           </div>
        </div>
      </div>
    </section>

    {/* Services Section */}
    <section id="services" className="py-16 md:py-20 bg-white scroll-mt-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-500">What The Platform Offers</p>
        </div>

        {/* 
            Update Grid Layout for Services:
            Mobile: grid-cols-2
            The 3rd item needs to span full width (col-span-2) to be "below them" and centered.
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
          
          {/* Item 1: Electronics */}
          <div className="bg-gray-50 p-4 md:p-8 rounded-xl shadow-lg border border-gray-100 hover:border-violet-200 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-violet-50 rounded-lg flex items-center justify-center mb-3 md:mb-6 text-violet-600">
               <Smartphone className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Electronics</h3>
            <ul className="text-gray-600 space-y-1 md:space-y-2 text-xs md:text-sm">
              <li>• Mobile & Laptops</li>
              <li>• Value based</li>
            </ul>
          </div>

          {/* Item 2: Vehicles */}
          <div className="bg-gray-50 p-4 md:p-8 rounded-xl shadow-lg border border-gray-100 hover:border-orange-200 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-3 md:mb-6 text-orange-500">
               <Car className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Vehicles</h3>
            <ul className="text-gray-600 space-y-1 md:space-y-2 text-xs md:text-sm">
              <li>• Bikes & Cars</li>
              <li>• Market based</li>
            </ul>
          </div>

          {/* Item 3: Quick Eligibility - Spans 2 cols on mobile */}
          <div className="col-span-2 md:col-span-1 bg-gray-50 p-4 md:p-8 rounded-xl shadow-lg border border-gray-100 hover:border-violet-200 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-violet-50 rounded-lg flex items-center justify-center mb-3 md:mb-6 text-violet-600">
               <Zap className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Quick Eligibility</h3>
            <ul className="text-gray-600 space-y-1 md:space-y-2 text-xs md:text-sm">
              <li>• Instant limits</li>
              <li>• Transparent fees</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* Frequently Asked Questions Section */}
    <FAQSection />

    {/* Our Locations Section (Updated to Orange Theme) */}
    <LocationsSection />

    {/* Live Hub Tracking Section */}
    <section id="live-tracking" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Live Hub Tracking</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Our AI-powered network monitors hub activity in real-time, ensuring efficient processing and security across all locations.</p>
        </div>
        <div className="flex justify-center">
          <RadarScanner />
        </div>
      </div>
    </section>

    {/* Customer Testimonials Section */}
    <TestimonialsSection />

  </div>
);

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LANDING);
  // RENAMED state from 'user' to 'userProfile' to match previous logic expectations and avoid ReferenceError
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // NEW: State to store Supabase Borrower ID
  const [borrowerId, setBorrowerId] = useState<string | null>(null);

  // New State for Popup
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Loan Application State
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>(null);
  const [assetDetails, setAssetDetails] = useState<AssetDetails | null>(null);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  
  // Footer Link State
  const [footerSection, setFooterSection] = useState<string | null>(null);

  useEffect(() => {
    // Splash logic
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    // Session Restore Logic
    const storedUser = localStorage.getItem('vegam_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.id) {
          setUserProfile(parsed);
          setBorrowerId(parsed.id);
          // Restore the user to dashboard if they have a valid session
          setCurrentStep(AppStep.DASHBOARD);
        }
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem('vegam_user');
      }
    }

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (profile: UserProfile) => {
    // profile contains the db ID and displayId from the service
    if (profile && profile.id) {
      setUserProfile(profile);
      setBorrowerId(profile.id);
      
      // Save session
      localStorage.setItem('vegam_user', JSON.stringify(profile));

      setCurrentStep(AppStep.DASHBOARD);
    }
  };
  
  // Refactored to separate state clearing from navigation logic
  const resetLoanState = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setAssetDetails(null);
    setValuationResult(null);
  };

  const handleLogout = () => {
    // Clear State
    setUserProfile(null);
    setBorrowerId(null);
    
    // Clear Session
    localStorage.removeItem('vegam_user');
    
    // Redirect to Landing Page (Welcome Page)
    setCurrentStep(AppStep.LANDING);
    
    // Just reset variables without triggering navigation
    resetLoanState();
  };

  const handleNewLoan = () => {
    // Reset loan states and navigate to selection
    resetLoanState();
    setCurrentStep(AppStep.ASSET_SELECTION);
  };

  const handleAssetSelect = (cat: AssetCategory, sub: SubCategory) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(sub);
    
    // Initialize empty details for the form
    setAssetDetails({
      category: cat,
      subCategory: sub,
      // ... other fields undefined
    });
    
    setCurrentStep(AppStep.ASSET_DETAILS);
  };

  const handleValuationComplete = (details: AssetDetails, result: ValuationResult) => {
    setAssetDetails(details);
    setValuationResult(result);
    setCurrentStep(AppStep.LOAN_CALCULATOR);
  };

  const handleLoanConfirm = async (config: LoanConfig, totalRepayment: number) => {
     if (userProfile && assetDetails && valuationResult && borrowerId) {
       
       // Submit entire application to Supabase
       // FIXED: Passing userProfile.name as the second argument
       const success = await submitLoanApplication(
         borrowerId,
         userProfile.name, // Pass the name for Table 2 and Table 3
         assetDetails,
         valuationResult,
         config,
         totalRepayment
       );
       
       if (success) {
         // Show Popup instead of full screen animation
         setShowSuccessModal(true);
         // Return to Dashboard 'background'
         setCurrentStep(AppStep.DASHBOARD);
       }
     } else if (!borrowerId) {
        // Fallback if borrowerId was lost (should not happen in normal flow)
        console.error("No borrower ID found. Cannot submit application.");
        alert("Session error. Please login again.");
        setCurrentStep(AppStep.LOGIN);
     }
  };

  const handleFooterLink = (sectionId: string) => {
    setFooterSection(sectionId);
    setCurrentStep(AppStep.LEGAL_INFO);
  };

  // Render Content Switch
  const renderContent = () => {
    switch (currentStep) {
      case AppStep.LANDING:
        return <LandingPage onStart={() => setCurrentStep(AppStep.LOGIN)} />;
      
      case AppStep.LOGIN:
        return (
          <div className="py-6 px-4 md:py-20">
            <LoginForm onComplete={handleLogin} />
          </div>
        );

      case AppStep.DASHBOARD:
        return userProfile ? (
          <Dashboard 
            user={userProfile} 
            onNewLoan={handleNewLoan} 
            onCheckStatus={() => setCurrentStep(AppStep.APPLICATION_STATUS)}
          />
        ) : null;

      case AppStep.APPLICATION_STATUS:
        return userProfile ? (
          <ApplicationStatus user={userProfile} onBack={() => setCurrentStep(AppStep.DASHBOARD)} />
        ) : null;

      case AppStep.ASSET_SELECTION:
        return (
          <div className="py-6 px-4 md:py-20">
            <AssetSelectionStep 
              onSelect={handleAssetSelect} 
              onBack={() => setCurrentStep(AppStep.DASHBOARD)} 
            />
          </div>
        );

      case AppStep.ASSET_DETAILS:
        return assetDetails ? (
          <div className="py-6 px-4 md:py-20">
            <AssetDetailsForm 
              initialData={assetDetails} 
              onValuationComplete={handleValuationComplete}
              onBack={() => setCurrentStep(AppStep.ASSET_SELECTION)}
            />
          </div>
        ) : null;

      case AppStep.LOAN_CALCULATOR:
        return valuationResult ? (
          <div className="py-6 px-4 md:py-20">
             <LoanCalculatorStep 
               valuation={valuationResult} 
               onConfirm={handleLoanConfirm}
               onBack={() => setCurrentStep(AppStep.ASSET_DETAILS)}
             />
          </div>
        ) : null;
        
      // AppStep.SUCCESS_ANIMATION is removed in favor of the modal logic above

      case AppStep.LEGAL_INFO:
        return (
          <LegalPage 
            sectionId={footerSection || undefined} 
            onBack={() => {
              setFooterSection(null);
              // Go back to previous logical step or Dashboard/Landing
              if (userProfile) setCurrentStep(AppStep.DASHBOARD);
              else setCurrentStep(AppStep.LANDING);
            }} 
          />
        );

      default:
        return <LandingPage onStart={() => setCurrentStep(AppStep.LOGIN)} />;
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-violet-200">
      {/* Global Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        onCheckStatus={() => {
          setShowSuccessModal(false);
          setCurrentStep(AppStep.APPLICATION_STATUS);
        }}
      />

      {currentStep !== AppStep.LEGAL_INFO && (
        <Header 
          currentStep={currentStep} 
          onNavigate={(step) => {
             // If navigating to Login but already logged in, go to Dashboard
             if (step === AppStep.LOGIN && userProfile) {
               setCurrentStep(AppStep.DASHBOARD);
             } else {
               setCurrentStep(step);
             }
          }} 
          isLoggedIn={!!userProfile}
          onLogout={handleLogout}
        />
      )}
      
      <main className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]">
        {renderContent()}
      </main>

      {currentStep !== AppStep.LEGAL_INFO && (
        <Footer onLinkClick={handleFooterLink} />
      )}
    </div>
  );
};

export default App;
