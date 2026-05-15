import React from 'react';
import { ResumeData } from '../types';

export const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="flex bg-white h-full w-full min-h-[1056px] mx-auto shadow-sm break-words relative overflow-hidden font-sans text-natural-text" id="resume-document">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-natural-panel text-natural-text p-8 border-r border-natural-border">
        {data.personalInfo.avatarUrl && (
          <div className="mb-6">
            <img src={data.personalInfo.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-lg object-cover border border-natural-border" />
          </div>
        )}
        <h1 className="text-3xl font-serif tracking-tight leading-tight mb-2 text-natural-accent" style={{ fontFamily: 'Georgia, serif' }}>
          {data.personalInfo.fullName || '姓名'}
        </h1>
        <p className="text-sm text-natural-muted font-bold tracking-widest uppercase mb-8">
          {data.personalInfo.jobTitle || '求职意向'}
        </p>

        <div className="space-y-4 mb-8 text-xs text-natural-text">
          {data.personalInfo.email && <div><span className="block font-bold text-[10px] text-natural-accent uppercase tracking-widest mb-1">邮箱</span>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div><span className="block font-bold text-[10px] text-natural-accent uppercase tracking-widest mb-1">电话</span>{data.personalInfo.phone}</div>}
          {data.personalInfo.birthDate && <div><span className="block font-bold text-[10px] text-natural-accent uppercase tracking-widest mb-1">出生年月日</span>{data.personalInfo.birthDate}</div>}
          {data.personalInfo.location && <div><span className="block font-bold text-[10px] text-natural-accent uppercase tracking-widest mb-1">所在地</span>{data.personalInfo.location}</div>}
          {data.personalInfo.website && <div><span className="block font-bold text-[10px] text-natural-accent uppercase tracking-widest mb-1">个人链接</span>{data.personalInfo.website}</div>}
        </div>

        {data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-natural-accent border-b border-natural-border pb-2 mb-4">常用技能</h2>
            <div className="flex flex-col gap-2 text-xs text-natural-text">
              {data.skills.map((skill, index) => <span key={index}>{skill}</span>)}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-10 bg-white">
        {data.personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-natural-accent border-b border-natural-border pb-2 mb-4">个人简介</h2>
            <p className="text-xs leading-relaxed text-natural-text">{data.personalInfo.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-natural-accent border-b border-natural-border pb-2 mb-4">工作经历</h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <h3 className="font-semibold text-sm text-natural-accent">{exp.role || '职位'}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-natural-text">{exp.company || '公司名称'}</span>
                    <span className="text-[10px] font-medium tracking-wide text-natural-muted uppercase">{exp.startDate} {exp.endDate && `— ${exp.endDate}`}</span>
                  </div>
                  <p className="text-xs text-natural-text leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-natural-accent border-b border-natural-border pb-2 mb-4">教育背景</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={edu.id || index}>
                  <h3 className="font-semibold text-sm text-natural-accent">{edu.degree ? `学历：${edu.degree}` : ''}{edu.degree && edu.fieldOfStudy ? '，' : ''}{edu.fieldOfStudy ? `专业：${edu.fieldOfStudy}` : ''}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-natural-text">{edu.school || '学校名'}</span>
                    <span className="text-[10px] font-medium tracking-wide text-natural-muted uppercase">{edu.startDate} {edu.endDate && `— ${edu.endDate}`}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-natural-accent border-b border-natural-border pb-2 mb-4">项目经历</h2>
            <div className="space-y-6">
              {data.projects.map((proj, index) => (
                <div key={proj.id || index}>
                  <h3 className="font-semibold text-sm text-natural-accent">{proj.title || '项目名称'}</h3>
                  {proj.link && <a href={proj.link} className="text-[10px] text-natural-muted block mb-2 font-medium underline" target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                  <p className="text-xs text-natural-text leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
