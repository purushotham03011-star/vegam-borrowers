
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AssetDetails, ValuationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for the valuation
const valuationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    estimatedValue: { type: Type.NUMBER, description: "Estimated market value in INR" },
    maxLoanAmount: { type: Type.NUMBER, description: "Maximum loan amount user can borrow (approx 60% of value)" },
    message: { type: Type.STRING, description: "A brief explanation of the valuation." },
    isEligible: { type: Type.BOOLEAN, description: "Whether the asset meets minimum criteria for a loan." },
  },
  required: ["estimatedValue", "maxLoanAmount", "message", "isEligible"],
};

export const assessAssetValue = async (details: AssetDetails): Promise<ValuationResult> => {
  try {
    const prompt = `
      Act as a professional loan underwriter in India.
      Evaluate the following asset for a collateral loan based on CURRENT secondary market prices in India.
      
      Asset Type: ${details.category} - ${details.subCategory}
      Brand/Make: ${details.brand || 'Unknown'}
      Model: ${details.model || 'Unknown'}
      Year: ${details.year || 'Unknown'}
      Condition: ${details.condition || 'Good'}
      Specs: ${details.ram ? `RAM: ${details.ram}, Storage: ${details.storage}` : ''} ${details.engineCC ? `Engine: ${details.engineCC}cc, Mileage: ${details.mileage}km` : ''}
      
      Rules:
      1. Be realistic. Check the depreciation for the specific brand and model.
      2. Electronics (Mobiles/Laptops) lose 30-50% value in the first year.
      3. Bikes/Cars depreciate based on year and mileage.
      4. Max Loan Amount should be strict: typically 60% of the Resale Value.
      5. If the brand is obscure or the item is too old (e.g., >5 years for phones), mark as not eligible or give very low value.
      
      Output strictly in Indian Rupee (INR).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: valuationSchema,
        temperature: 0.1, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as ValuationResult;

  } catch (error) {
    console.error("Valuation error:", error);
    // Fallback in case of API error
    return {
      estimatedValue: 0,
      maxLoanAmount: 0,
      message: "Unable to verify asset details automatically. Please visit a branch.",
      isEligible: false
    };
  }
};
