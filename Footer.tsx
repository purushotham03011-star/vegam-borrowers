
import React from 'react';
import { 
  ShieldCheck, AlertTriangle, Percent, Headphones, 
  Link as LinkIcon, Scale 
} from 'lucide-react';

interface FooterProps {
  onLinkClick: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  const footerLinks = [
    { id: 'market-disclaimer', label: 'Market Value & Limitation Disclaimer', icon: AlertTriangle },
    { id: 'security', label: 'Security & Data Assurance', icon: ShieldCheck },
    { id: 'transparency', label: 'Financial Transparency (Fees & APR)', icon: Percent },
    { id: 'support', label: 'Customer Support', icon: Headphones },
    { id: 'intermediary', label: 'Intermediary Status Disclosure', icon: LinkIcon },
    { id: 'legal-policies', label: 'Legal Policies', icon: Scale },
  ];

  return (
    <footer className="bg-[#111827] border-t border-gray-800 pt-16 pb-8 mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              {/* Custom 3D Arrow Shape Logo matching user image - Keeping Original Colors */}
              <div className="mr-3">
                <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Back Shadow Layer */}
                  <path d="M4 12 L44 32 L4 52 L16 32 Z" fill="#2DD4BF" opacity="0.8" transform="translate(-2, 2)"/>
                  {/* Main Arrow Body */}
                  <path d="M10 10 L54 32 L10 54 L24 32 Z" fill="#99F6E4" stroke="#1F2937" strokeWidth="6" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-wide font-serif">
                Vegam Borrowers
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering your financial journey with AI-driven asset valuation and secure lending connections.
            </p>
          </div>
          
          <div className="md:col-span-3">
             <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider text-violet-400">Legal & Support</h3>
             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
               {footerLinks.map((link) => (
                 <button
                   key={link.id}
                   onClick={() => onLinkClick(link.id)}
                   className="flex items-start text-left group p-2 -ml-2 rounded-lg hover:bg-gray-800/50 transition-all"
                 >
                   <div className="mt-0.5 mr-3 p-1.5 bg-gray-800 rounded-md group-hover:bg-violet-900/30 group-hover:text-violet-400 text-gray-400 transition-colors">
                      <link.icon className="w-4 h-4" />
                   </div>
                   <span className="text-gray-400 text-sm group-hover:text-white transition-colors font-medium">
                     {link.label}
                   </span>
                 </button>
               ))}
             </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Vegam Borrowers. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with Trust & Transparency.</p>
        </div>
      </div>
    </footer>
  );
};
