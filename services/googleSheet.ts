
// This service has been deprecated. 
// Please use services/loanService.ts with Supabase.
export const saveToGoogleSheet = async (data: any) => {
  console.warn("Google Sheets integration is removed. Use Supabase.");
  return true; 
};
