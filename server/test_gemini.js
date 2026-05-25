import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Create a dummy 1x1 png base64
    const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const mimeType = "image/png";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Test text" },
            { 
              inlineData: {
                data: base64Image,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction: "Test system instruction",
        temperature: 0.1,
      }
    });

    console.log("Success:", response.text);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
