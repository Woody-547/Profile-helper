export interface PersonalInfo {
  fullName: string;
  avatarUrl?: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  birthDate?: string;
  website: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

export type TemplateType = 'minimal' | 'professional';

export type LLMProvider = 'gemini' | 'openai-compatible';

export interface LLMSettings {
  provider: LLMProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}
