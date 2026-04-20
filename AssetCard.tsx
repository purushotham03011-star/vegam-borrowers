
import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface AssetCardProps {
  title: string;
  MainIcon: LucideIcon;
  gradient: string;
  options: { label: string; value: string; icon?: LucideIcon }[];
  onSelect: (subCategory: any) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ title, MainIcon, gradient, options, onSelect }) => {
  return (
    <div className="relative group bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:shadow-violet-200 transition-all duration-500 border border-gray-100 overflow-hidden h-auto md:h-96 flex flex-col justify-between">
      
      {/* Decorative Gradient Blob */}
      <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-700 ${gradient}`} />
      <div className={`absolute bottom-0 left-0 w-full h-1.5 ${gradient}`} />

      {/* Header Content */}
      <div className="relative z-10 text-center mt-2 md:mt-4 mb-6 md:mb-0">
        <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-white shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300 ${gradient}`}>
          <MainIcon className="h-8 w-8 md:h-10 md:w-10" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{title}</h3>
        <p className="text-gray-500 text-xs md:text-sm">Select your specific item below</p>
      </div>

      {/* Options List */}
      <div className="relative z-10 space-y-3 mt-0 md:mt-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(opt.value);
            }}
            className="w-full bg-gray-50 hover:bg-white text-gray-700 hover:text-violet-600 border border-transparent hover:border-violet-100 rounded-xl px-4 py-3 md:px-5 md:py-4 flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-md group/btn"
          >
            <span className="font-semibold text-sm md:text-base flex items-center gap-3">
              {opt.icon && <opt.icon className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover/btn:text-violet-500 transition-colors" />}
              {opt.label}
            </span>
            <div className="bg-white group-hover/btn:bg-violet-50 p-1 md:p-1.5 rounded-full transition-colors text-gray-400 group-hover/btn:text-violet-500 border border-gray-100 group-hover/btn:border-violet-100">
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
