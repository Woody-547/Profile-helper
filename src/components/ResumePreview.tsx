import React from 'react';
import { useResume } from '../context/ResumeContext';
import { MinimalTemplate } from '../templates/MinimalTemplate';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate';

export const ResumePreview: React.FC = () => {
  const { data, template } = useResume();

  return (
    <div className="w-full h-full">
      {template === 'minimal' && <MinimalTemplate data={data} />}
      {template === 'professional' && <ProfessionalTemplate data={data} />}
    </div>
  );
};
