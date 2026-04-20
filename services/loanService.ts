
import { supabase } from './supabaseClient';
import { UserProfile, AssetDetails, LoanConfig, ValuationResult } from '../types';

// Helper to format errors into readable strings safely
const formatError = (error: any): Error => {
  if (error instanceof Error) return error;
  
  let msg = "An unexpected error occurred.";
  
  // Handle Supabase error objects or strings
  if (typeof error === 'string') {
    msg = error;
  } else if (typeof error === 'object' && error !== null) {
    // Prioritize specific Supabase error fields, strictly checking for strings
    if (typeof error.message === 'string') {
      msg = error.message;
    } else if (typeof error.error_description === 'string') {
      msg = error.error_description;
    } else if (typeof error.details === 'string') {
      msg = error.details;
    } else {
      // Fallback: try to stringify
      try {
        msg = JSON.stringify(error);
        if (msg === '{}') msg = "Unknown error details.";
      } catch (e) {
        msg = "Error object could not be serialized.";
      }
    }
  }
  
  return new Error(msg);
};

// 1. Register New Borrower (Sign Up)
export const registerBorrower = async (profile: UserProfile) => {
  try {
    // Check if mobile already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('borrowers')
      .select('id')
      .eq('mobile', profile.mobile)
      .maybeSingle();
      
    if (checkError) throw checkError;

    if (existingUser) {
      throw new Error("Mobile number already registered. Please login.");
    }

    // ID Generation Logic
    const { count, error: countError } = await supabase
      .from('borrowers')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    const sequenceNumber = (count || 0) + 101; // Starts at 101
    const cityInitial = profile.city ? profile.city.charAt(0).toUpperCase() : 'X';
    const generatedId = `${cityInitial}${sequenceNumber}`;

    // Insert new user
    const { data, error } = await supabase
      .from('borrowers')
      .insert([{ 
        name: profile.name, 
        mobile: profile.mobile, 
        city: profile.city,
        email: profile.email,
        custom_id: generatedId 
      }])
      .select()
      .single();

    if (error) throw error;
    
    // Return profile with the new IDs
    return {
      ...profile,
      id: data.id,
      displayId: data.custom_id
    };

  } catch (error: any) {
    console.error('Registration error details:', error);
    throw formatError(error);
  }
};

// 2. Login Existing Borrower
export const loginBorrower = async (identifier: string, mobile: string) => {
  try {
    // Fetch by mobile first
    const { data, error } = await supabase
      .from('borrowers')
      .select('*')
      .eq('mobile', mobile)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error("Account not found. Please sign up.");
    }

    // Verify Name OR Custom ID
    // identifier could be Name (case-insensitive) OR custom_id (e.g. V101)
    const dbName = (data.name || '').trim().toLowerCase();
    const dbCustomId = (data.custom_id || '').trim().toLowerCase();
    
    // Normalize input
    const inputId = identifier.trim().toLowerCase();
    
    // Check match - Strictly check both name and ID case-insensitively
    const isNameMatch = dbName === inputId;
    const isIdMatch = dbCustomId === inputId;

    if (!isNameMatch && !isIdMatch) {
      throw new Error("Name or Borrower ID does not match the registered mobile number.");
    }

    // Login successful
    return {
      name: data.name,
      mobile: data.mobile,
      city: data.city,
      email: data.email,
      id: data.id,
      displayId: data.custom_id,
      isKycVerified: true
    } as UserProfile;

  } catch (error: any) {
    console.error('Login error:', error);
    throw formatError(error);
  }
};

// 3. Submit Final Loan Application
export const submitLoanApplication = async (
  borrowerId: string,
  borrowerName: string,
  asset: AssetDetails,
  valuation: ValuationResult,
  config: LoanConfig,
  totalRepayment: number
) => {
  try {
    // --- Insert into Table 2: loan_applications ---
    const { error: appError } = await supabase
      .from('loan_applications')
      .insert([{
        borrower_id: borrowerId,
        borrower_name: borrowerName,
        
        // Asset Data
        category: asset.category,
        sub_category: asset.subCategory,
        brand: asset.brand,
        model: asset.model,
        year: asset.year || null,
        condition: asset.condition,
        specs: {
          ram: asset.ram,
          storage: asset.storage,
          engineCC: asset.engineCC,
          mileage: asset.mileage,
          fuelType: asset.fuelType,
          hasRC: asset.hasRC,
          hasInsurance: asset.hasInsurance
        },

        // Loan Data
        interest_rate: config.interestRate,
        total_repayment: totalRepayment,
        status: 'submitted'
      }]);

    if (appError) throw appError;

    // --- Insert into Table 3: loan_summaries ---
    const { error: summaryError } = await supabase
      .from('loan_summaries')
      .insert([{
        borrower_name: borrowerName,
        category: asset.category,
        sub_category: asset.subCategory,
        total_repayment: totalRepayment
      }]);

    if (summaryError) throw summaryError;

    // --- Insert into Table 4 (NEW): application_status ---
    // Stores specific JSON blocks as requested by user specification
    const { error: statusError } = await supabase
      .from('application_status')
      .insert([{
        borrower_id: borrowerId,
        name: borrowerName,
        asset_details: asset, // Stores full AssetDetails object (including photos)
        loan_requested: {
          amount: config.requestedAmount,
          durationValue: config.durationValue,
          durationUnit: config.durationUnit,
          interestRate: config.interestRate,
          totalRepayment: totalRepayment
        }
      }]);

    if (statusError) throw statusError;

    return true;
  } catch (error) {
    console.error('Error creating loan application:', error);
    const err = formatError(error);
    alert(`Error submitting application: ${err.message}`);
    return false;
  }
};

// 4. Fetch Application Status (New)
export const fetchApplicationStatus = async (borrowerId: string) => {
  try {
    const { data, error } = await supabase
      .from('application_status')
      .select('*')
      .eq('borrower_id', borrowerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching status:', error);
    throw formatError(error);
  }
};
