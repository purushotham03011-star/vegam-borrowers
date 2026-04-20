
export type AssetCategory = 'electronics' | 'vehicles' | null;
export type SubCategory = 'mobile' | 'laptop' | 'bike' | 'car' | null;

export interface UserProfile {
  id?: string; // Supabase UUID
  displayId?: string; // Generated ID like V101
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  pan?: string;
  isKycVerified?: boolean;
}

export interface AssetDetails {
  category: AssetCategory;
  subCategory: SubCategory;
  brand?: string;
  model?: string;
  year?: string;
  condition?: string; 
  // Electronics specific
  ram?: string;
  storage?: string;
  // Vehicle specific
  engineCC?: string;
  mileage?: string;
  fuelType?: string;
  hasRC?: boolean;
  hasInsurance?: boolean;
  // Uploads
  photoNames?: string[];
}

export interface ValuationResult {
  estimatedValue: number;
  maxLoanAmount: number;
  message: string;
  isEligible: boolean;
}

export interface LoanConfig {
  requestedAmount: number;
  durationValue: number;
  durationUnit: 'weeks' | 'months' | 'years';
  interestRate: number;
}

export enum AppStep {
  LANDING = 0,
  LOGIN = 1,
  DASHBOARD = 2,
  ASSET_SELECTION = 3,
  ASSET_DETAILS = 4,
  LOAN_CALCULATOR = 5,
  SUCCESS_ANIMATION = 6, // Deprecated but kept for index consistency if needed
  LEGAL_INFO = 7,
  APPLICATION_STATUS = 8,
}
