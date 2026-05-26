import { GoogleGenAI } from '@google/genai';

try {
  const ai = new GoogleGenAI({ apiKey: "invalid \n key" });
  console.log("No error on init");
} catch(e) {
  console.error("Init Error:", e.message);
}
