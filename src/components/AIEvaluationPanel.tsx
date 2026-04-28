import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { useSettings } from '../context/SettingsContext';
import { evaluateResume, EvaluationResult } from '../services/geminiService';
import { Sparkles } from 'lucide-react';

export const AIEvaluationPanel = () => {
  const { data } = useResume();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState('');

  const handleEvaluate = async () => {
    setLoading(true);
    setError('');
    try {
      const evaluation = await evaluateResume(data, settings);
      setResult(evaluation);
    } catch (err) {
      setError('简历评估失败，请检查 AI 设置（API Key 和 Base URL）是否正确。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-natural-border shadow-sm p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-6 border-b border-natural-border pb-4">
        <div className="bg-natural-nav p-1.5 rounded-lg border border-natural-border">
          <Sparkles className="text-natural-accent w-4 h-4" />
        </div>
        <h2 className="text-sm font-bold tracking-widest uppercase text-natural-accent">AI 智能评估</h2>
      </div>
      
      {!result && !loading && (
        <div>
          <p className="text-natural-text mb-6 text-sm leading-relaxed">
            为您生成深度的简历评估。我们的 AI 模型会从语法、排版、内容等维度为您的简历打分，并提供专业的修改建议。
          </p>
          <button onClick={handleEvaluate} className="w-full bg-natural-accent hover:opacity-90 text-white font-medium py-3 px-4 rounded-xl transition flex justify-center items-center gap-2 shadow-sm text-sm">
            <Sparkles size={16} /> 生成评估报告
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-natural-accent mb-4"></div>
          <p className="text-natural-accent text-sm font-medium animate-pulse">正在深度分析您的简历...</p>
        </div>
      )}

      {error && <p className="text-red-500 bg-red-50 p-4 rounded-lg text-sm">{error}</p>}

      {result && !loading && (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="mb-4 text-center">
            <div className="relative inline-block">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="var(--color-natural-bg)" strokeWidth="8" fill="transparent" />
                <circle cx="64" cy="64" r="58" stroke="var(--color-natural-accent)" strokeWidth="8" fill="transparent" strokeDasharray="364" strokeDashoffset={364 - (364 * result.score) / 100} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-serif font-bold text-natural-accent">{result.score}</span>
                <span className="text-[10px] uppercase text-natural-light">综合评分</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div className="p-4 rounded-2xl bg-natural-card border border-natural-bg">
                <p className="text-xs font-bold text-natural-accent mb-2">简历优势</p>
                <div className="space-y-2">
                  {result.strengths.map((str, i) => (
                    <div key={i} className="flex items-start text-xs space-x-3">
                      <div className="w-4 h-4 mt-0.5 shrink-0 rounded-full bg-natural-accent flex items-center justify-center text-white text-[8px]">✓</div>
                      <span className="text-natural-text leading-relaxed">{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses */}
            {result.weaknesses.length > 0 && (
              <div className="p-4 rounded-2xl bg-natural-card border border-natural-bg">
                <p className="text-xs font-bold text-natural-accent mb-2">待优化项</p>
                <div className="space-y-2">
                  {result.weaknesses.map((weak, i) => (
                    <div key={i} className="flex items-start text-xs space-x-3">
                      <div className="w-4 h-4 mt-0.5 shrink-0 rounded-full border border-natural-border flex items-center justify-center text-[10px] text-natural-muted">!</div>
                      <span className="text-natural-text leading-relaxed">{weak}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="p-4 rounded-2xl bg-natural-card border border-natural-bg">
                <p className="text-xs font-bold text-natural-accent mb-2">可行建议</p>
                <div className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <p key={i} className="text-xs text-natural-text leading-relaxed border-l-2 border-natural-accent pl-2">
                      {tip}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleEvaluate} className="w-full py-3 bg-natural-nav hover:opacity-80 text-natural-accent border border-natural-border rounded-xl text-xs font-bold transition-colors shadow-sm">
              重新请求评估
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
