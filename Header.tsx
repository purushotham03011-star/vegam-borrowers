
import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { AppStep } from '../types';

interface HeaderProps {
  onNavigate: (step: AppStep) => void;
  currentStep: AppStep;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentStep, isLoggedIn, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false); // Close menu on click
    if (currentStep !== AppStep.LANDING) {
      // If we are logged in, we might stay on Dashboard/Status, but if user wants to see "About" 
      // which is on Landing, we navigate there. 
      // However, usually for SPA, we might want to keep the header simple.
      // If user clicks "About" while logged in, let's go to Landing.
      onNavigate(AppStep.LANDING);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleMobileNav = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  };

  const handleApplicationStatusClick = () => {
    if (isLoggedIn) {
      onNavigate(AppStep.APPLICATION_STATUS);
    } else {
      onNavigate(AppStep.LOGIN);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => isLoggedIn ? onNavigate(AppStep.DASHBOARD) : scrollToSection('hero')}
          >
            <div className="mr-2 md:mr-3 transform group-hover:scale-110 transition-transform duration-300">
              {/* Custom 3D Arrow Shape Logo */}
              <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-[42px] md:h-[42px]">
                <path d="M4 12 L44 32 L4 52 L16 32 Z" fill="#2DD4BF" opacity="0.8" transform="translate(-2, 2)"/>
                <path d="M10 10 L54 32 L10 54 L24 32 Z" fill="#99F6E4" stroke="#1F2937" strokeWidth="6" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900 tracking-wide font-serif">
              Vegam
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-8">
              {!isLoggedIn && (
                <>
                  <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-violet-600 font-medium transition-colors text-sm">About</button>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-violet-600 font-medium transition-colors text-sm">How it Works</button>
                </>
              )}
              {isLoggedIn && (
                 <button onClick={() => onNavigate(AppStep.DASHBOARD)} className="text-gray-600 hover:text-violet-600 font-medium transition-colors text-sm">Dashboard</button>
              )}
              <button onClick={() => onNavigate(AppStep.LOGIN)} className="text-gray-600 hover:text-violet-600 font-medium transition-colors text-sm">Asset Estimation</button>
              <button onClick={handleApplicationStatusClick} className="text-gray-600 hover:text-violet-600 font-medium transition-colors text-sm">Application Status</button>
            </nav>
            
            {isLoggedIn ? (
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition-all text-sm border border-gray-200"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              currentStep === AppStep.LANDING && (
                <button 
                  onClick={() => onNavigate(AppStep.LOGIN)}
                  className="bg-violet-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-violet-700 transition-all transform hover:-translate-y-0.5 shadow-md shadow-violet-200 text-sm"
                >
                  Login
                </button>
              )
            )}
          </div>
          
           {/* Mobile Menu Button */}
           <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
           </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-5 fade-in duration-200">
          <nav className="flex flex-col p-4 space-y-4">
             {!isLoggedIn && (
               <>
                 <button onClick={() => handleMobileNav(() => scrollToSection('about'))} className="text-left px-4 py-3 rounded-xl hover:bg-violet-50 text-gray-700 font-medium">About</button>
                 <button onClick={() => handleMobileNav(() => scrollToSection('how-it-works'))} className="text-left px-4 py-3 rounded-xl hover:bg-violet-50 text-gray-700 font-medium">How it Works</button>
               </>
             )}
             {isLoggedIn && (
               <button onClick={() => handleMobileNav(() => onNavigate(AppStep.DASHBOARD))} className="text-left px-4 py-3 rounded-xl hover:bg-violet-50 text-gray-700 font-medium">Dashboard</button>
             )}
             <button onClick={() => handleMobileNav(() => onNavigate(AppStep.LOGIN))} className="text-left px-4 py-3 rounded-xl hover:bg-violet-50 text-gray-700 font-medium">Asset Estimation</button>
             <button onClick={() => handleMobileNav(handleApplicationStatusClick)} className="text-left px-4 py-3 rounded-xl hover:bg-violet-50 text-gray-700 font-medium">Application Status</button>
             
             {isLoggedIn ? (
               <button 
                 onClick={() => handleMobileNav(onLogout)}
                 className="w-full bg-gray-100 text-gray-800 px-6 py-4 rounded-xl font-bold text-center mt-2 flex items-center justify-center gap-2"
               >
                 <LogOut size={18} /> Logout
               </button>
             ) : (
               currentStep === AppStep.LANDING && (
                 <button 
                   onClick={() => handleMobileNav(() => onNavigate(AppStep.LOGIN))}
                   className="w-full bg-violet-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-violet-200 text-center mt-2"
                 >
                   Login / Get Started
                 </button>
               )
             )}
          </nav>
        </div>
      )}
    </header>
  );
};
