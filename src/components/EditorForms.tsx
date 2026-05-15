import React, { useRef, useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Experience, Education, Project } from '../types';
import { Plus, Trash2, Upload, User } from 'lucide-react';

export const PersonalInfoForm = () => {
  const { data, setData } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [e.target.name]: e.target.value }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({
           ...prev,
           personalInfo: { ...prev.personalInfo, avatarUrl: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 text-natural-text">
      <h2 className="text-xl font-bold mb-4">个人信息</h2>
      
      <div className="flex items-center gap-6 mb-4">
        <div 
          className="w-20 h-20 rounded-full border border-natural-border bg-natural-panel flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition relative group"
          onClick={() => fileInputRef.current?.click()}
        >
          {data.personalInfo.avatarUrl ? (
            <img src={data.personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="text-natural-muted w-8 h-8" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <Upload className="text-white w-6 h-6" />
          </div>
        </div>
        <div className="flex-1 space-y-1 text-sm">
          <p className="font-medium text-natural-text">上传头像 (可选)</p>
          <p className="text-natural-muted text-xs">建议上传正方形免冠照片。点击左侧圆圈上传。</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          {data.personalInfo.avatarUrl && (
            <button 
              className="text-red-500 hover:text-red-600 text-xs mt-2 transition"
              onClick={() => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, avatarUrl: '' } }))}
            >
              移除头像
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium mb-1 text-natural-text">姓名</label>
          <input name="fullName" value={data.personalInfo.fullName} onChange={handleChange} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent focus:border-transparent outline-none" placeholder="例如：张三" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium mb-1 text-natural-text">职位 / 求职意向</label>
          <input name="jobTitle" value={data.personalInfo.jobTitle} onChange={handleChange} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent focus:border-transparent outline-none" placeholder="例如：高级前端工程师" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium mb-1 text-natural-text">邮箱</label>
          <input type="email" name="email" value={data.personalInfo.email} onChange={handleChange} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent focus:border-transparent outline-none" placeholder="例如：zhangsan@example.com" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium mb-1 text-natural-text">电话</label>
          <input name="phone" value={data.personalInfo.phone} onChange={handleChange} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent focus:border-transparent outline-none" placeholder="例如：138 0000 0000" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium mb-1 text-natural-text">所在地</label>
          <input name="location" value={data.personalInfo.location} onChange={handleChange} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent focus:border-transparent outline-none" placeholder="例如：北京，朝阳区" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium mb-1 text-natural-text">出生年月日</label>
          <input name="birthDate" value={data.personalInfo.birthDate || ''} onChange={handleChange} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent focus:border-transparent outline-none" placeholder="例如：1995年5月" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium mb-1 text-natural-text">个人主页 / 链接</label>
          <input name="website" value={data.personalInfo.website} onChange={handleChange} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent focus:border-transparent outline-none" placeholder="例如：github.com/zhangsan" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-natural-text">个人简介</label>
        <textarea name="summary" value={data.personalInfo.summary} onChange={handleChange} rows={4} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent focus:border-transparent outline-none" placeholder="一段关于您工作经验与优势的简短介绍..." />
      </div>
    </div>
  );
};

export const ExperienceForm = () => {
  const { data, setData } = useResume();

  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', description: '' };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  return (
    <div className="space-y-6 text-natural-text">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">工作经历</h2>
        <button onClick={addExperience} className="flex items-center gap-1 text-sm bg-natural-accent text-white px-3 py-1.5 rounded-xl hover:opacity-90 transition">
          <Plus size={16} /> 添加工作
        </button>
      </div>

      {data.experience.map((exp, index) => (
        <div key={exp.id} className="relative p-4 border border-natural-border rounded-2xl bg-white mb-4 shadow-sm text-natural-text">
          <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-natural-light hover:text-red-500 transition">
             <Trash2 size={18} />
          </button>
          
          <div className="grid grid-cols-2 gap-4 mt-2 border-l-4 border-l-natural-accent pl-4 rounded-sm">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1 text-natural-text">公司名称</label>
              <input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="输入公司名称" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1 text-natural-text">职位 / 头衔</label>
              <input value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="例如：高级开发工程师" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1 text-natural-text">开始时间</label>
              <input value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="如：2021.05" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1 text-natural-text">结束时间</label>
              <input value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="如：至今" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-natural-text">经历描述</label>
              <textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} rows={4} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="具体描述你的工作内容和取得的成果..." />
            </div>
          </div>
        </div>
      ))}
      {data.experience.length === 0 && <p className="text-natural-muted text-sm italic">暂无工作经历。请点击上方按钮添加。</p>}
    </div>
  );
};

export const EducationForm = () => {
  const { data, setData } = useResume();

  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  return (
    <div className="space-y-6 text-natural-text">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">教育背景</h2>
        <button onClick={addEducation} className="flex items-center gap-1 text-sm bg-natural-accent text-white px-3 py-1.5 rounded-xl hover:opacity-90 transition">
          <Plus size={16} /> 添加教育
        </button>
      </div>

      {data.education.map((edu, index) => (
        <div key={edu.id} className="relative p-4 border border-natural-border rounded-2xl bg-white mb-4 shadow-sm text-natural-text">
          <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-natural-light hover:text-red-500 transition">
             <Trash2 size={18} />
          </button>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-natural-text">学校 / 机构</label>
              <input value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="输入学校名称" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1 text-natural-text">学历 / 学位</label>
              <input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="例如：本科" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1 text-natural-text">专业</label>
              <input value={edu.fieldOfStudy} onChange={e => updateEducation(edu.id, 'fieldOfStudy', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="例如：计算机科学" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1 text-natural-text">入学时间</label>
              <input value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="2016" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1 text-natural-text">毕业时间</label>
              <input value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="2020 或预计毕业年份" />
            </div>
          </div>
        </div>
      ))}
      {data.education.length === 0 && <p className="text-natural-muted text-sm italic">暂无教育背景。</p>}
    </div>
  );
};

export const SkillsForm = () => {
  const { data, setData } = useResume();
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      setData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  return (
    <div className="space-y-4 text-natural-text">
      <h2 className="text-xl font-bold mb-4">掌握技能</h2>
      <div className="flex gap-2">
        <input 
          value={skillInput} 
          onChange={e => setSkillInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && addSkill()}
          className="flex-1 border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" 
          placeholder="如：React, 数据分析 (按回车快速添加)" 
        />
        <button onClick={addSkill} className="bg-natural-accent text-white px-4 py-2 rounded-xl hover:opacity-90 transition">
            添加
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {data.skills.map((skill, index) => (
          <div key={index} className="bg-natural-border text-natural-text px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {skill}
            <button onClick={() => removeSkill(skill)} className="text-natural-muted hover:text-red-500">&times;</button>
          </div>
        ))}
        {data.skills.length === 0 && <span className="text-natural-muted text-sm italic">尚未添加技能标签。</span>}
      </div>
    </div>
  );
};

export const ProjectsForm = () => {
  const { data, setData } = useResume();

  const addProject = () => {
    const newProj: Project = { id: Date.now().toString(), title: '', description: '', link: '' };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
    }));
  };

  const removeProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  return (
    <div className="space-y-6 text-natural-text">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">项目经历</h2>
        <button onClick={addProject} className="flex items-center gap-1 text-sm bg-natural-accent text-white px-3 py-1.5 rounded-xl hover:opacity-90 transition">
          <Plus size={16} /> 添加项目
        </button>
      </div>

      {data.projects.map((proj) => (
        <div key={proj.id} className="relative p-4 border border-natural-border rounded-2xl bg-white mb-4 shadow-sm text-natural-text">
          <button onClick={() => removeProject(proj.id)} className="absolute top-4 right-4 text-natural-light hover:text-red-500 transition">
             <Trash2 size={18} />
          </button>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
             <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1 text-natural-text">项目名称</label>
              <input value={proj.title} onChange={e => updateProject(proj.id, 'title', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="输入项目名称" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1 text-natural-text">项目链接</label>
              <input value={proj.link} onChange={e => updateProject(proj.id, 'link', e.target.value)} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="如：github.com/myproject" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-natural-text">项目描述</label>
              <textarea value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} rows={3} className="w-full border border-natural-border rounded-xl p-2 focus:ring-2 focus:ring-natural-accent outline-none" placeholder="描述此项目的内容以及您的关键贡献..." />
            </div>
          </div>
        </div>
      ))}
      {data.projects.length === 0 && <p className="text-natural-muted text-sm italic">暂无相关项目。</p>}
    </div>
  );
};
