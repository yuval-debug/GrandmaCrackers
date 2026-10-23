import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Say hello in one word.',
    });
    console.log('✅ API SUCCESS:', response.text);
  } catch (err) {
    console.error('❌ API ERROR STATUS:', err.status);
    console.error('❌ FULL ERROR:', err.message);
  }
}

test();