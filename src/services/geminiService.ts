import { GoogleGenAI, Type } from '@google/genai';
import { ResumeData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface EvaluationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
}

export async function evaluateResume(resumeData: ResumeData): Promise<EvaluationResult> {
  const prompt = `You are an expert HR and ATS resume reviewer. 
Review the following resume data and provide a professional evaluation.
Please provide your entire response in Chinese (Simplified).
Resume Data:
${JSON.stringify(resumeData, null, 2)}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Resume score out of 100 based on ATS friendliness and content quality." },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of strengths in Chinese." },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Areas for improvement in Chinese." },
            tips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable tips for improving the resume in Chinese." }
          },
          required: ["score", "strengths", "weaknesses", "tips"]
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as EvaluationResult;
  } catch (error) {
    console.error("Failed to evaluate resume:", error);
    throw error;
  }
}
