
import React, { useEffect, useState } from 'react';
import { fetchApplicationStatus } from '../services/loanService';
import { UserProfile } from '../types';
import { 
  ChevronDown, ChevronUp, AlertCircle, ChevronLeft, Package, 
  Banknote, ImageIcon, Smartphone, Laptop, Bike, Car 
} from 'lucide-react';

interface ApplicationStatusProps {
  user: UserProfile;
  onBack: () => void;
}

export const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ user, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatus = async () => {
      if (!user.id) {
        setError("User ID not found.");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchApplicationStatus(user.id);
        setApplications(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadStatus();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-50 p-6 rounded-2xl text-red-600 border border-red-100 flex flex-col items-center">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p>{error}</p>
          <button onClick={onBack} className="mt-4 text-sm underline hover:text-red-800">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
       <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" /> Back to Dashboard
       </button>
       
       <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Application Status</h1>
       <p className="text-gray-500 mb-8">Track your submitted loan requests.</p>

       {applications.length === 0 ? (
         <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No applications found.</p>
            <p className="text-sm text-gray-400 mt-1">Start a new loan request from the dashboard.</p>
         </div>
       ) : (
         <div className="space-y-6">
           {applications.map((app) => (
             <StatusCard key={app.id} application={app} />
           ))}
         </div>
       )}
    </div>
  );
};

const getAssetIcon = (subCategory: string | undefined) => {
  switch (subCategory) {
    case 'mobile': return <Smartphone className="w-6 h-6 text-violet-600" />;
    case 'laptop': return <Laptop className="w-6 h-6 text-violet-600" />;
    case 'bike': return <Bike className="w-6 h-6 text-orange-500" />;
    case 'car': return <Car className="w-6 h-6 text-orange-500" />;
    default: return <Package className="w-6 h-6 text-gray-400" />;
  }
};

const formatAssetName = (subCategory: string | undefined, category: string | undefined) => {
  if (subCategory) {
    // Capitalize first letter (e.g. mobile -> Mobile)
    return subCategory.charAt(0).toUpperCase() + subCategory.slice(1);
  }
  if (category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  return 'Unknown Asset';
};

const StatusCard: React.FC<{ application: any }> = ({ application }) => {
  const [isAssetExpanded, setIsAssetExpanded] = useState(false);
  const { asset_details: asset, loan_requested: loan } = application;

  const dateStr = new Date(application.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-bold text-gray-900">{application.name}</h3>
           <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">
             Pending Review
           </span>
        </div>
        <p className="text-xs text-gray-400">Submitted on: {dateStr}</p>
      </div>

      <div className="p-6 space-y-6">

        {/* 1. Asset Details Dropdown (Moved to Top) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <button 
            onClick={() => setIsAssetExpanded(!isAssetExpanded)}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
          >
             <div className="flex items-center gap-4">
               <div className={`p-2 rounded-lg bg-opacity-10 ${['bike','car'].includes(asset?.subCategory) ? 'bg-orange-100' : 'bg-violet-100'}`}>
                 {getAssetIcon(asset?.subCategory)}
               </div>
               <div className="text-left">
                  <p className="text-base font-bold text-gray-900">
                    {formatAssetName(asset?.subCategory, asset?.category)}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">{asset?.brand} {asset?.model}</p>
               </div>
             </div>
             {isAssetExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {isAssetExpanded && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm space-y-3 animate-in slide-in-from-top-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                 <DetailRow label="Brand" value={asset?.brand} />
                 <DetailRow label="Model" value={asset?.model} />
                 
                 {asset?.category === 'electronics' ? (
                   <>
                     <DetailRow label="RAM" value={asset?.ram} />
                     <DetailRow label="Storage" value={asset?.storage} />
                     <DetailRow label="Condition" value={asset?.condition} />
                   </>
                 ) : (
                   <>
                     <DetailRow label="Year" value={asset?.year} />
                     <DetailRow label={asset?.subCategory === 'bike' ? "Engine CC" : "Mileage"} value={asset?.subCategory === 'bike' ? asset?.engineCC : asset?.mileage} />
                     <DetailRow label="Fuel Type" value={asset?.fuelType} />
                     <DetailRow label="RC Available" value={asset?.hasRC ? "Yes" : "No"} />
                     <DetailRow label="Insurance" value={asset?.hasInsurance ? "Yes" : "No"} />
                   </>
                 )}
              </div>

              {/* Photos */}
              {asset?.photoNames && asset.photoNames.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Uploaded Photos
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {asset.photoNames.map((name: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600 truncate max-w-[150px]">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 2. Loan Requested Section (Moved Below Asset) */}
        <div>
          <h4 className="flex items-center text-sm font-bold text-violet-600 mb-3 uppercase tracking-wider">
            <Banknote className="w-4 h-4 mr-2" /> Loan Details
          </h4>
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
             <div className="text-center md:text-left">
               <p className="text-xs text-gray-500 mb-1">Amount</p>
               <p className="font-bold text-gray-900 text-lg">₹{loan?.amount?.toLocaleString()}</p>
             </div>
             <div className="text-center md:text-left border-l border-gray-200 pl-4">
               <p className="text-xs text-gray-500 mb-1">Tenure</p>
               <p className="font-bold text-gray-900">{loan?.durationValue} {loan?.durationUnit}</p>
             </div>
             <div className="text-center md:text-left border-l border-gray-200 pl-4">
               <p className="text-xs text-gray-500 mb-1">Interest</p>
               <p className="font-bold text-gray-900">{loan?.interestRate}%</p>
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800">{value || '--'}</span>
  </div>
);
