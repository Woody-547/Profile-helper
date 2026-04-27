import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData, TemplateType } from '../types';

interface ResumeContextType {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  template: TemplateType;
  setTemplate: React.Dispatch<React.SetStateAction<TemplateType>>;
}

const defaultData: ResumeData = {
  personalInfo: {
    fullName: '',
    avatarUrl: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ResumeData>(defaultData);
  const [template, setTemplate] = useState<TemplateType>('minimal');

  return (
    <ResumeContext.Provider value={{ data, setData, template, setTemplate }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
