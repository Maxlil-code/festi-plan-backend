import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client
let geminiClient = null;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    geminiClient = new GoogleGenAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini client:', error.message);
  }
} else {
  console.warn('⚠️ Gemini API key not configured. AI features will use fallback responses.');
}

export { geminiClient };
