import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.WILLIAM_API_KEY;

if (!apiKey) {
  throw new Error("WILLIAM_API_KEY is not loaded.");
}

const ai = new GoogleGenAI({
  apiKey,
});

const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: "Say exactly: AOM Gemini connection successful.",
});

console.log(response.text);