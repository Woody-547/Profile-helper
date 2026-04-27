import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles, Layout } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-natural-bg font-sans selection:bg-natural-nav text-natural-text">
      <nav className="border-b border-natural-border bg-natural-panel">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2 border border-natural-border bg-white p-1.5 pr-3 rounded-xl shadow-sm text-natural-accent">
            <div className="bg-natural-accent p-1.5 rounded-xl">
              <FileText className="text-white w-5 h-5" />
            </div>
            AI 简历
          </div>
          <button 
            onClick={() => navigate('/editor')}
            className="bg-natural-accent text-white px-5 py-2 rounded-lg hover:opacity-90 font-medium text-sm transition-all shadow-sm"
          >
            前往编辑器
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
          <h1 className="text-5xl md:text-6xl font-extrabold text-natural-accent tracking-tight leading-[1.1] mb-6">
            制作专业简历 <span className="text-natural-text">由 AI 驱动</span>
          </h1>
          <p className="text-xl text-natural-muted mb-10 font-light leading-relaxed">
            只需几分钟即可创建符合求职标准的精美简历。选择优雅的模板，无缝编辑内容，并从 Google Gemini 的 AI 评估引擎获取即时优化反馈。
          </p>
          <button 
            onClick={() => navigate('/editor')}
            className="inline-flex items-center gap-2 bg-natural-accent text-white px-8 py-4 rounded-xl font-medium text-lg hover:opacity-90 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            创建你的简历 
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-natural-border hover:shadow-md transition duration-300">
            <div className="h-12 w-12 bg-natural-nav border border-natural-border rounded-xl flex items-center justify-center text-natural-accent mb-6 font-bold">
              <Layout size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-natural-text tracking-tight">精美模板</h3>
            <p className="text-natural-muted leading-relaxed font-medium">选择专业设计的简历模板，在保持排版规范整洁的同时令人眼前一亮。</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-natural-border hover:shadow-md transition duration-300">
             <div className="h-12 w-12 bg-natural-nav border border-natural-border rounded-xl flex items-center justify-center text-natural-accent mb-6 font-bold">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-natural-text tracking-tight">实时预览</h3>
            <p className="text-natural-muted leading-relaxed font-medium">输入时即刻看到简历排版变化。分屏界面让你的信息编辑过程顺畅无比，所见即所得。</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-natural-border hover:shadow-md transition duration-300">
             <div className="h-12 w-12 bg-natural-nav border border-natural-border rounded-xl flex items-center justify-center text-natural-accent mb-6 font-bold">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-natural-text tracking-tight">AI 智能评估</h3>
            <p className="text-natural-muted leading-relaxed font-medium">获取即时简历评分、挖掘个人优势，并获取实用的修改建议，助力拿下心仪 Offer。</p>
          </div>
        </div>
      </main>
    </div>
  );
};
