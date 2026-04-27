import React from 'react';
import { ResumeData } from '../types';

export const MinimalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="font-sans text-natural-text p-12 bg-white h-full w-full min-h-[1056px] mx-auto shadow-sm break-words relative overflow-hidden flex flex-col" id="resume-document">
      
      <header className="text-center space-y-2 mb-6">
        {data.personalInfo.avatarUrl && (
          <div className="flex justify-center mb-4">
            <img src={data.personalInfo.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border border-natural-border" />
          </div>
        )}
        <h1 className="text-4xl font-serif tracking-tight text-natural-text" style={{ fontFamily: 'Georgia, serif' }}>
          {data.personalInfo.fullName || '姓名'}
        </h1>
        <p className="text-xs tracking-widest uppercase text-natural-accent">
          {data.personalInfo.jobTitle || '求职意向'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-3 text-[10px] text-natural-muted font-medium">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
        </div>
      </header>

      <div className="h-[1px] w-full bg-natural-border mb-8"></div>

      {data.personalInfo.summary && (
        <section className="mb-8">
          <p className="text-xs leading-relaxed text-natural-text">{data.personalInfo.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-natural-accent mb-4">工作经历</h3>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-semibold text-natural-text">{exp.role || '职位'}, {exp.company || '公司名称'}</span>
                  <span className="text-[10px] text-natural-muted">{exp.startDate} {exp.endDate && `— ${exp.endDate}`}</span>
                </div>
                <p className="text-xs text-natural-text mt-1 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-natural-accent mb-4">教育背景</h3>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-natural-text">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</span>
                  <span className="text-[10px] text-natural-muted">{edu.school || '学校名'}, {edu.endDate || edu.startDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-natural-accent mb-4">常用技能</h3>
          <div className="flex flex-wrap gap-2 text-xs text-natural-text">
            {data.skills.join(' • ')}
          </div>
        </section>
      )}
      
      {data.projects.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-natural-accent mb-4">项目经历</h3>
          <div className="space-y-6">
            {data.projects.map((proj, index) => (
              <div key={proj.id || index}>
                <div className="flex items-baseline mb-1">
                  <span className="text-sm font-semibold text-natural-text">{proj.title || '项目名称'}</span>
                  {proj.link && <a href={proj.link} className="text-[10px] text-natural-muted ml-2 underline" target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                </div>
                <p className="text-xs text-natural-text mt-1 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
