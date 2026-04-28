import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Layout, FileText, Upload, Settings as SettingsIcon } from 'lucide-react';
import { PersonalInfoForm, ExperienceForm, EducationForm, SkillsForm, ProjectsForm } from '../components/EditorForms';
import { ResumePreview } from '../components/ResumePreview';
import { useResume } from '../context/ResumeContext';
import { AIEvaluationPanel } from '../components/AIEvaluationPanel';
import { TemplateType } from '../types';
import { exportToWord } from '../utils/exportWord';
import { parseFile } from '../services/importService';
import { SettingsDialog } from '../components/SettingsDialog';
import { useSettings } from '../context/SettingsContext';

export const EditorPage = () => {
  const { data, setData, template, setTemplate } = useResume();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<'details' | 'ai'>('details');
  const [isImporting, setIsImporting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    try {
      const parsedData = await parseFile(file, settings);
      setData(prev => ({
        ...prev,
        ...parsedData,
        personalInfo: {
          ...parsedData.personalInfo,
          avatarUrl: prev.personalInfo.avatarUrl // Keep avatar if uploaded manually, or maybe parsedData lacks it
        }
      }));
    } catch (error) {
      console.error("Import failed:", error);
      alert('导入失败，请确保您上传的是包含文本内容的有效PDF或Word文件。');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('resume-document');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert('无法生成 PDF，请重试。');
    }
  };

  const handleDownloadWord = async () => {
    try {
      await exportToWord(data);
    } catch (error) {
      console.error("Failed to generate Word document", error);
      alert('无法生成 Word 文档，请重试。');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-natural-bg overflow-hidden font-sans text-natural-text">
      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-natural-border bg-natural-bg shrink-0 z-10">
        <h1 className="text-lg font-semibold text-natural-accent">AI 简历平台</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-natural-border p-1 rounded-lg bg-natural-panel">
            <Layout size={16} className="text-natural-accent ml-2" />
            <select 
              value={template} 
              onChange={(e) => setTemplate(e.target.value as TemplateType)}
              className="bg-transparent border-none text-sm font-medium py-1 outline-none text-natural-text pr-2 cursor-pointer"
            >
              <option value="minimal">极简模板</option>
              <option value="professional">专业模板</option>
            </select>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            className="hidden" 
          />
          <button 
            onClick={handleImportClick}
            disabled={isImporting}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-white text-natural-text border border-natural-border rounded-lg shadow-sm hover:bg-natural-panel transition disabled:opacity-50"
          >
            <Upload size={18} />
            {isImporting ? '导入中...' : '导入简历'}
          </button>
          
          <button 
            onClick={handleDownloadWord}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-white text-natural-text border border-natural-border rounded-lg shadow-sm hover:bg-natural-panel transition"
          >
            <FileText size={18} />
            导出 Word
          </button>
          <button 
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-natural-accent text-white rounded-lg shadow-sm hover:opacity-90 transition"
          >
            <Download size={18} />
            导出 PDF
          </button>
          
          <div className="h-4 w-px bg-natural-border mx-1" />
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-natural-muted hover:text-natural-accent transition rounded-lg hover:bg-natural-panel"
            title="AI 设置"
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>
      
      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel - Editor / AI */}
        <div className="w-full md:w-[600px] flex flex-col border-r border-natural-border bg-natural-panel shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-0 relative shrink-0">
          
          <div className="flex border-b border-natural-border shrink-0 px-4 pt-4">
            <button 
              className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors duration-200 ${activeTab === 'details' ? 'border-natural-accent text-natural-accent' : 'border-transparent text-natural-muted hover:text-natural-text'}`}
              onClick={() => setActiveTab('details')}
            >
              编辑简历
            </button>
            <button 
              className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-1.5 duration-200 ${activeTab === 'ai' ? 'border-natural-accent text-natural-accent' : 'border-transparent text-natural-muted hover:text-natural-text'}`}
              onClick={() => setActiveTab('ai')}
            >
              AI 评估 <span className="flex h-2 w-2 rounded-full bg-natural-light mb-2.5"></span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 scroll-smooth will-change-scroll pb-32 bg-natural-panel">
            {activeTab === 'details' ? (
              <div className="space-y-12 animate-in fade-in duration-300">
                <PersonalInfoForm />
                <div className="h-px bg-natural-border w-full" />
                <ExperienceForm />
                <div className="h-px bg-natural-border w-full" />
                <EducationForm />
                <div className="h-px bg-natural-border w-full" />
                <SkillsForm />
                <div className="h-px bg-natural-border w-full" />
                <ProjectsForm />
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <AIEvaluationPanel />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-natural-nav p-8 overflow-y-auto min-w-0 flex justify-center items-start">
          {/* Constrain width and aspect ratio for realistic A4 preview */}
          <div className="w-full max-w-[210mm] shadow-2xl bg-white origin-top">
            <ResumePreview />
          </div>
        </div>

      </div>
    </div>
  );
};
