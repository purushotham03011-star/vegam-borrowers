import { GoogleGenAI, Type } from '@google/genai';
import { AssetDetails, ValuationResult } from '../types';

const API_KEY = process.env.GEMINI_API_KEY;

const buildPrompt = (asset: AssetDetails): string => {
  const lines: string[] = [
    `Asset Category: ${asset.category ?? 'unknown'}`,
    `Sub-Category: ${asset.subCategory ?? 'unknown'}`,
    asset.brand ? `Brand: ${asset.brand}` : '',
    asset.model ? `Model: ${asset.model}` : '',
    asset.year ? `Year: ${asset.year}` : '',
    asset.condition ? `Condition: ${asset.condition}` : '',
    asset.ram ? `RAM: ${asset.ram}` : '',
    asset.storage ? `Storage: ${asset.storage}` : '',
    asset.engineCC ? `Engine CC: ${asset.engineCC}` : '',
    asset.mileage ? `Mileage: ${asset.mileage}` : '',
    asset.fuelType ? `Fuel Type: ${asset.fuelType}` : '',
    typeof asset.hasRC === 'boolean' ? `Has RC: ${asset.hasRC}` : '',
    typeof asset.hasInsurance === 'boolean' ? `Has Insurance: ${asset.hasInsurance}` : '',
  ].filter(Boolean);

  return [
    'You are a used-asset valuation assistant for a lender operating in India.',
    'Estimate the current fair market resale value (in INR) for the asset described below',
    'and determine the maximum secured loan amount (up to 70% of estimated value).',
    'Set isEligible to true only if the estimated value is at least 2000 INR.',
    'Respond concisely and return JSON only.',
    '',
    'Asset details:',
    ...lines,
  ].join('\n');
};

const heuristicFallback = (asset: AssetDetails): ValuationResult => {
  let base = 0;
  switch (asset.subCategory) {
    case 'mobile': base = 15000; break;
    case 'laptop': base = 35000; break;
    case 'bike': base = 60000; break;
    case 'car': base = 300000; break;
    default: base = 10000;
  }

  const conditionMultiplier: Record<string, number> = {
    'New': 1,
    'Like New': 0.85,
    'Good': 0.7,
    'Fair': 0.5,
  };
  const multiplier = asset.condition ? (conditionMultiplier[asset.condition] ?? 0.6) : 0.6;

  const currentYear = new Date().getFullYear();
  const yearNum = asset.year ? parseInt(asset.year, 10) : currentYear;
  const age = Math.max(0, currentYear - (Number.isFinite(yearNum) ? yearNum : currentYear));
  const ageFactor = Math.max(0.3, 1 - age * 0.08);

  const estimatedValue = Math.round(base * multiplier * ageFactor);
  const maxLoanAmount = Math.round(estimatedValue * 0.7);
  const isEligible = estimatedValue >= 2000;

  return {
    estimatedValue,
    maxLoanAmount,
    message: isEligible
      ? 'Estimated using offline heuristics.'
      : 'Asset value is too low to qualify for a loan.',
    isEligible,
  };
};

export const assessAssetValue = async (asset: AssetDetails): Promise<ValuationResult> => {
  if (!API_KEY) {
    return heuristicFallback(asset);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildPrompt(asset),
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedValue: { type: Type.NUMBER },
            maxLoanAmount: { type: Type.NUMBER },
            message: { type: Type.STRING },
            isEligible: { type: Type.BOOLEAN },
          },
          required: ['estimatedValue', 'maxLoanAmount', 'message', 'isEligible'],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(text) as ValuationResult;
    return {
      estimatedValue: Number(parsed.estimatedValue) || 0,
      maxLoanAmount: Number(parsed.maxLoanAmount) || 0,
      message: String(parsed.message || ''),
      isEligible: Boolean(parsed.isEligible),
    };
  } catch (err) {
    console.error('Gemini valuation failed, using fallback:', err);
    return heuristicFallback(asset);
  }
};
