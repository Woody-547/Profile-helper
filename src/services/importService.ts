import mammoth from 'mammoth';
import { GoogleGenAI, Type } from '@google/genai';
import OpenAI from 'openai';
import { ResumeData, LLMSettings } from '../types';

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        jobTitle: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        birthDate: { type: Type.STRING },
        website: { type: Type.STRING },
        summary: { type: Type.STRING },
      },
      required: ["fullName", "jobTitle", "email", "phone", "location", "website", "summary"]
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
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
          id: { type: Type.STRING },
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
          id: { type: Type.STRING },
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

export async function parseFile(file: File, settings: LLMSettings): Promise<ResumeData> {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        return extractFromText(text, settings);
    } else if (ext === 'pdf') {
        if (settings.provider === 'openai-compatible') {
            throw new Error("目前非 Gemini 模型暂不支持直接解析 PDF 文件，请尝试上传 Word (docx) 格式。");
        }
        const base64 = await toBase64(file);
        return extractFromPDF(base64, settings);
    } else {
        throw new Error("仅支持上传 PDF 或 DOCX 格式的文件");
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

async function extractFromText(text: string, settings: LLMSettings): Promise<ResumeData> {
    const prompt = "You are an expert at extracting information from resumes. Parse the following text into the structured JSON data. Ensure all strings are in Chinese (Simplified). Translate if necessary.\n\n" + text;
    
    if (settings.provider === 'openai-compatible') {
        const openai = new OpenAI({
            apiKey: settings.apiKey,
            baseURL: settings.baseUrl,
            dangerouslyAllowBrowser: true
        });

        const response = await openai.chat.completions.create({
            model: settings.model || 'deepseek-chat',
            messages: [
                { role: 'system', content: 'You are an expert at extracting resume information into JSON. Respond only with valid JSON.' },
                { role: 'user', content: prompt + '\n\nOutput must follow the schema for ResumeData.' }
            ],
            response_format: { type: 'json_object' }
        });

        return JSON.parse(response.choices[0].message.content || '{}') as ResumeData;
    }

    const apiKey = settings.apiKey || ((import.meta as any).env.VITE_GEMINI_API_KEY as string) || '';
    if (!apiKey) {
        throw new Error("未检测到 API Key。如果您在 GitHub Pages 上使用，请点击右上角的【AI 设置】配置您的 DeepSeek 或 Gemini 密钥。");
    }
    const ai = new GoogleGenAI({ apiKey });
    
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

async function extractFromPDF(base64Data: string, settings: LLMSettings): Promise<ResumeData> {
    const prompt = "You are an expert at extracting information from resumes. Parse this PDF document into the structured JSON data. Ensure all strings are in Chinese (Simplified). Translate if necessary.";
    
    const apiKey = settings.apiKey || ((import.meta as any).env.VITE_GEMINI_API_KEY as string) || '';
    if (!apiKey) {
        throw new Error("未检测到 API Key。解析 PDF 需要配置 Gemini API Key（暂不支持 DeepSeek 解析 PDF）。");
    }
    const ai = new GoogleGenAI({ apiKey });

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
