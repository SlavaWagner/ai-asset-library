import axios from 'axios';
import { getConfig } from './config.js';

export async function generateText(prompt) {
  const config = getConfig();
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // If no key provided, return null so calling agent can use intelligent fallback/rule generator
    return null;
  }

  const model = config.geminiModel || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const candidate = response.data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;
    return text || null;
  } catch (err) {
    console.log(`[Gemini API Warning]: ${err.message}. Using rule-based generator fallback.`);
    return null;
  }
}

