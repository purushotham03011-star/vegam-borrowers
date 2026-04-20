
import React, { useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, Percent, Headphones, 
  Link as LinkIcon, Scale, Lock, FileText, ChevronLeft, ArrowRight
} from 'lucide-react';

interface LegalPageProps {
  sectionId?: string;
  onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ sectionId, onBack }) => {
  
  const legalSections = [
    { id: 'market-disclaimer', label: 'Market Value & Limitation Disclaimer', icon: AlertTriangle },
    { id: 'security', label: 'Security & Data Assurance', icon: ShieldCheck },
    { id: 'transparency', label: 'Financial Transparency (Fees & APR)', icon: Percent },
    { id: 'support', label: 'Customer Support', icon: Headphones },
    { id: 'intermediary', label: 'Intermediary Status Disclosure', icon: LinkIcon },
    { id: 'legal-policies', label: 'Legal Policies', icon: Scale },
  ];

  // Scroll to section on mount
  useEffect(() => {
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [sectionId]);

  const scrollTo = (id: string) => {
     const element = document.getElementById(id);
     if(element) {
       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] pb-20 pt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center text-teal-400 hover:text-teal-300 font-medium mb-8 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back to Application
        </button>

        <h1 className="text-4xl font-serif font-bold text-white mb-4">Legal & Compliance</h1>
        <p className="text-gray-400 text-lg mb-12">Transparency and trust are at the core of our operations. Select a topic below or scroll to review our policies.</p>

        {/* Navigation Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
           {legalSections.map((item) => (
              <button 
                key={item.id} 
                onClick={() => scrollTo(item.id)}
                className="flex items-center p-4 bg-[#1E293B] border border-gray-700 rounded-xl hover:border-teal-500/50 hover:bg-[#1E293B]/80 transition-all text-left group shadow-sm hover:shadow-md"
              >
                 <div className="p-2.5 bg-[#0B1120] rounded-lg text-gray-400 group-hover:text-teal-400 mr-4 border border-gray-800 group-hover:border-teal-900/50 transition-colors">
                   <item.icon size={20} />
                 </div>
                 <span className="text-gray-300 font-medium group-hover:text-white text-sm pr-2">{item.label}</span>
                 <ArrowRight className="ml-auto w-4 h-4 text-gray-600 group-hover:text-teal-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
              </button>
           ))}
        </div>

        <div className="space-y-16 border-t border-gray-800 pt-16">
          
          {/* 1. Market Value & Limitation Disclaimer */}
          <section id="market-disclaimer" className="bg-[#1E293B] rounded-2xl p-8 border border-gray-700 shadow-lg scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-900/20 rounded-lg text-yellow-500">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Market Value & Limitation Disclaimer</h2>
            </div>
            <div className="bg-[#0B1120] p-5 rounded-xl border border-yellow-900/30">
              <p className="text-gray-300 italic">
                "Disclaimer: Loan limits displayed are indicative estimates based on real-time market value and asset condition. Final disbursal amounts are subject to physical verification and lender approval at the time of processing."
              </p>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Since the app provides "Instant Loans Against Assets", we must protect the business from price changes in the electronics/vehicle market. The calculator values are estimates, not guarantees.
            </p>
          </section>

          {/* 2. Security & Data Assurance */}
          <section id="security" className="bg-[#1E293B] rounded-2xl p-8 border border-gray-700 shadow-lg scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teal-900/20 rounded-lg text-teal-500">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Security & Data Assurance</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
              <div className="flex items-center gap-2 bg-green-900/20 text-green-400 px-4 py-2 rounded-full border border-green-900/50">
                <Lock size={16} />
                <span className="font-bold text-sm">256-bit SSL Secured</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Your data and assets are insured and stored in secure, monitored facilities. We do not share your personal details with third parties without consent.
            </p>
          </section>

          {/* 3. Financial Transparency (Fees & APR) */}
          <section id="transparency" className="bg-[#1E293B] rounded-2xl p-8 border border-gray-700 shadow-lg scroll-mt-24">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-900/20 rounded-lg text-blue-500">
                <Percent size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Financial Transparency (Fees & APR)</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">
                <strong>Representative Example:</strong> Annual Percentage Rate (APR) starts at 12%. Platform fees may apply based on the loan amount. All fees are transparently displayed before you connect to a lender.
              </p>
              <ul className="list-disc pl-5 text-gray-400 mt-2 space-y-1">
                <li>Interest Rate: Starts @ 12% p.a.</li>
                <li>Platform Fees: ~2% (Min ₹500)</li>
                <li>No Hidden Charges</li>
              </ul>
            </div>
          </section>

          {/* 4. Customer Support */}
          <section id="support" className="bg-[#1E293B] rounded-2xl p-8 border border-gray-700 shadow-lg scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-900/20 rounded-lg text-purple-500">
                <Headphones size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Customer Support (24/7 Access)</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#0B1120] p-4 rounded-xl border border-gray-700">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Helpline</p>
                <p className="text-white font-mono text-lg">+91-98765-XXXXX</p>
              </div>
              <div className="bg-[#0B1120] p-4 rounded-xl border border-gray-700">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Email Support</p>
                <p className="text-white font-mono text-lg">support@vegam.com</p>
              </div>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              <strong>Grievance Officer:</strong> Mr. Rajesh Kumar (Available Mon-Fri, 10 AM - 6 PM)
            </p>
          </section>

          {/* 5. Intermediary Status Disclosure */}
          <section id="intermediary" className="bg-[#1E293B] rounded-2xl p-8 border border-gray-700 shadow-lg scroll-mt-24">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-900/20 rounded-lg text-orange-500">
                <LinkIcon size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Intermediary Status Disclosure</h2>
            </div>
            <p className="text-gray-300 leading-relaxed border-l-4 border-orange-500 pl-4">
              "Vegam Borrowers acts as a technology facilitator connecting users with RBI-licensed Banks and NBFCs. We do not directly issue loans or hold deposits."
            </p>
          </section>

          {/* 6. Legal Policies */}
          <section id="legal-policies" className="bg-[#1E293B] rounded-2xl p-8 border border-gray-700 shadow-lg scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-900/20 rounded-lg text-red-500">
                <Scale size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Legal Policies</h2>
            </div>

            <div className="space-y-8">
              {/* Privacy Policy */}
              <div>
                <h3 className="flex items-center text-xl font-bold text-white mb-3">
                  <FileText className="mr-2 text-teal-500" size={20}/> Privacy Policy
                </h3>
                <div className="text-gray-400 text-sm space-y-3 pl-7 border-l border-gray-700 ml-2.5">
                  <p><strong>1. Data Collection:</strong> We collect personal information including your Name and Mobile Number, as well as specific details regarding your assets (Brand, Model, Condition) to facilitate loan valuation and processing.</p>
                  <p><strong>2. Use of Information:</strong> The data collected is used to provide instant asset valuation, connect requests with registered lenders, and verify identity via OTP.</p>
                  <p><strong>3. Data Sharing:</strong> Vegam Borrowers acts as a technology bridge. By submitting a request, you consent to us sharing your relevant details with third-party lenders solely for the purpose of processing your loan application. We do not sell your data to unauthorized marketing agencies.</p>
                  <p><strong>4. Security:</strong> We employ industry-standard encryption (SSL) and secure storage protocols to protect your personal and asset data.</p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <h3 className="flex items-center text-xl font-bold text-white mb-3">
                  <FileText className="mr-2 text-teal-500" size={20}/> Terms & Conditions
                </h3>
                 <div className="text-gray-400 text-sm space-y-3 pl-7 border-l border-gray-700 ml-2.5">
                  <p><strong>1. Nature of Service:</strong> Vegam Borrowers is a technology platform that connects borrowers with lenders. We are not a bank or a deposit-taking institution. All loan approvals are at the sole discretion of our lending partners.</p>
                  <p><strong>2. Asset Valuation & Estimates:</strong> The loan amounts and interest rates displayed on our "Customize Plan" calculator are indicative estimates based on the details you provide. Final loan values are subject to physical verification of the asset by the lender.</p>
                  <p><strong>3. User Responsibility:</strong> You agree that all details provided regarding the asset’s condition are accurate. Any discrepancy found during physical inspection may result in a revised loan offer or rejection of the request.</p>
                  <p><strong>4. Limitation of Liability:</strong> Vegam Borrowers is not liable for market fluctuations that may alter the value of your asset between the time of online estimation and final disbursal.</p>
                </div>
              </div>

              {/* Fair Practice Code */}
              <div>
                <h3 className="flex items-center text-xl font-bold text-white mb-3">
                  <FileText className="mr-2 text-teal-500" size={20}/> Fair Practice Code
                </h3>
                 <div className="text-gray-400 text-sm space-y-3 pl-7 border-l border-gray-700 ml-2.5">
                  <p><strong>1. Transparency in Pricing:</strong> We are committed to full disclosure. All applicable costs, including Interest Rates (APR), Platform Fees, and Repayment Schedules, are displayed upfront on the app interface before you submit a request.</p>
                  <p><strong>2. Non-Coercive Recovery:</strong> Our lending partners follow RBI-mandated ethical guidelines for asset handling and loan recovery. We ensure that borrowers are treated with respect and dignity throughout the loan tenure.</p>
                  <p><strong>3. Grievance Redressal:</strong> We have a dedicated support mechanism for resolving customer disputes. If you have a complaint, you can escalate it to our Grievance Officer at support@vegam.com.</p>
                  <p><strong>4. Asset Safety:</strong> We ensure that any asset pledged is stored in secure, insured facilities for the duration of the loan term.</p>
                </div>
              </div>

               {/* Cancellation & Refund Policy */}
               <div>
                <h3 className="flex items-center text-xl font-bold text-white mb-3">
                  <FileText className="mr-2 text-teal-500" size={20}/> Cancellation & Refund Policy
                </h3>
                 <div className="text-gray-400 text-sm space-y-3 pl-7 border-l border-gray-700 ml-2.5">
                  <p>For any cancellations or refund requests regarding platform fees or processing errors, please contact our Helpline immediately. Refunds are processed based on the stage of the application and the policies of the specific lender assigned.</p>
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
