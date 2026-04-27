import mammoth from 'mammoth';
import { GoogleGenAI, Type } from '@google/genai';
import { ResumeData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING, description: "Name of the person" },
        jobTitle: { type: Type.STRING, description: "Current or target job title" },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        website: { type: Type.STRING },
        summary: { type: Type.STRING, description: "Professional summary or about me" },
      },
      required: ["fullName", "jobTitle", "email", "phone", "location", "website", "summary"]
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Generate a unique string ID" },
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["id", "company", "role", "startDate", "endDate", "description"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Generate a unique string ID" },
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          fieldOfStudy: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING }
        },
        required: ["id", "school", "degree", "fieldOfStudy", "startDate", "endDate"]
      }
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Generate a unique string ID" },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          link: { type: Type.STRING }
        },
        required: ["id", "title", "description", "link"]
      }
    }
  },
  required: ["personalInfo", "experience", "education", "skills", "projects"]
};

export async function parseFile(file: File): Promise<ResumeData> {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        return extractFromText(text);
    } else if (ext === 'pdf') {
        const base64 = await toBase64(file);
        return extractFromPDF(base64);
    } else {
        throw new Error("仅支持上传PDF或DOCX格式的文件");
    }
}

function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
}

async function extractFromText(text: string): Promise<ResumeData> {
    const prompt = "You are an expert at extracting information from resumes. Parse the following text into the structured JSON data. Ensure all strings are in Chinese (Simplified). Translate if necessary.\n\n" + text;
    
    const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumeSchema as any
        }
    });

    if (!response.text) {
        throw new Error("提取失败");
    }

    return JSON.parse(response.text.trim()) as ResumeData;
}

async function extractFromPDF(base64Data: string): Promise<ResumeData> {
    const prompt = "You are an expert at extracting information from resumes. Parse this PDF document into the structured JSON data. Ensure all strings are in Chinese (Simplified). Translate if necessary.";
    
    const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
            { text: prompt },
            {
               inlineData: {
                   mimeType: "application/pdf",
                   data: base64Data
               }
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: resumeSchema as any
        }
    });
    
    if (!response.text) {
        throw new Error("提取失败");
    }

    return JSON.parse(response.text.trim()) as ResumeData;
}
