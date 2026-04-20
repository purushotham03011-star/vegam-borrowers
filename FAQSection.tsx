
import React, { useState } from 'react';

// The Logo Component for the FAQ
const FAQLogo = ({ isOpen }: { isOpen: boolean }) => (
  <svg 
    width="28" 
    height="28" 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-all duration-500 ease-out transform ${isOpen ? 'rotate-90' : 'rotate-0'}`}
  >
    {/* Shadow - changes color on open */}
    <path 
      d="M4 12 L44 32 L4 52 L16 32 Z" 
      fill={isOpen ? "#A78BFA" : "#CBD5E1"} // Violet Light vs Slate Light
      className="transition-colors duration-500"
      transform="translate(-2, 2)"
    />
    
    {/* Main Body - changes color on open */}
    <path 
      d="M10 10 L54 32 L10 54 L24 32 Z" 
      fill={isOpen ? "#8B5CF6" : "#F1F5F9"} // Violet vs Slate 100
      stroke={isOpen ? "#7C3AED" : "#94A3B8"} 
      strokeWidth="6" 
      strokeLinejoin="round"
      className="transition-colors duration-500"
    />
  </svg>
);

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-violet-600' : 'text-gray-700 group-hover:text-violet-600'}`}>
          {question}
        </span>
        <div className="ml-4 flex-shrink-0">
          <FAQLogo isOpen={isOpen} />
        </div>
      </button>
      <div 
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0 pb-0'}`}
      >
        <div className="overflow-hidden">
          <div className="text-gray-600 leading-relaxed pr-8 pl-1 border-l-2 border-violet-200 ml-1">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FAQSection = () => {
  const faqs: FAQItemProps[] = [
    {
      question: "1 What Is Collateral?",
      answer: (
        <>
          <p className="mb-3">Collateral is a valuable asset that a borrower pledges as security for a loan, serving thus as a guarantee for the lender.</p>
          <p>For example, For a car loan, the vehicle is the collateral. A business that obtains financing from a bank may pledge valuable equipment or real estate owned by the business as collateral for the loan. In the event of a default, the lender can seize the collateral and sell it to recoup the loss.</p>
        </>
      )
    },
    {
      question: "2- Key Takeaways.",
      answer: (
        <ul className="list-none space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0"></span>
            Collateral reduces the risk for lenders.
          </li>
          <li className="flex items-start gap-2">
             <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0"></span>
            If a borrower defaults on the loan, the lender can seize the collateral and sell it to recoup its losses.
          </li>
          <li className="flex items-start gap-2">
             <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0"></span>
            Mortgages and car loans are two types of collateralized loans.
          </li>
          <li className="flex items-start gap-2">
             <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0"></span>
            Other personal assets, such as a savings or investment account, can be used to secure a collateralized personal loan.
          </li>
        </ul>
      )
    },
    {
      question: "3- Can I get a loan based on collateral?",
      answer: "Yes, financial institutions provide loans against collateral security, where borrowers pledge assets to access funds. The loan amount, interest rate, and tenure depend on the collateral type, its value, and the lender's assessment criteria."
    },
    {
      question: "4- How do I make my loan payments?",
      answer: "Payment methods will vary depending on the lender and the type of loan you have. Some lenders may allow you to make payments online, while others may require you to send a check or money order by mail. Be sure to carefully review the terms and conditions of your loan to understand your payment options."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-gray-50 scroll-mt-20 border-t border-gray-100 relative overflow-hidden">
       {/* Background Decoration */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Frequently asked questions.</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-violet-600 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-xl border border-gray-100">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};
