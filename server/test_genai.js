import { GoogleGenAI } from '@google/genai';
console.log("Imported GoogleGenAI");
try {
  const ai = new GoogleGenAI({ apiKey: "test_key" });
  console.log("Instantiated");
} catch(e) {
  console.error("Error:", e);
}
