import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Globe, Key, Cpu } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-natural-border flex items-center justify-between bg-natural-panel">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-natural-accent" />
            <h2 className="font-bold text-natural-text text-lg">AI 设置</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-natural-bg rounded-xl transition text-natural-muted hover:text-natural-text">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-natural-text mb-2">
                <Globe size={16} className="text-natural-accent" />
                模型提供商
              </label>
              <select 
                value={localSettings.provider}
                onChange={(e) => setLocalSettings({ ...localSettings, provider: e.target.value as any })}
                className="w-full border border-natural-border rounded-xl p-3 focus:ring-2 focus:ring-natural-accent outline-none text-sm font-medium"
              >
                <option value="gemini">Google Gemini (默认)</option>
                <option value="openai-compatible">OpenAI 兼容 (如 DeepSeek)</option>
              </select>
            </div>

            {localSettings.provider === 'openai-compatible' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-natural-text mb-2">
                  <Globe size={16} className="text-natural-accent" />
                  API 基础链接 (Base URL)
                </label>
                <input 
                  value={localSettings.baseUrl}
                  onChange={(e) => setLocalSettings({ ...localSettings, baseUrl: e.target.value })}
                  placeholder="https://api.deepseek.com"
                  className="w-full border border-natural-border rounded-xl p-3 focus:ring-2 focus:ring-natural-accent outline-none text-sm"
                />
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-natural-text mb-2">
                <Key size={16} className="text-natural-accent" />
                API 密钥 (API Key)
              </label>
              <input 
                type="password"
                value={localSettings.apiKey}
                onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
                placeholder={localSettings.provider === 'gemini' ? '留空则使用系统内置 Key' : '请输入您的 API Key'}
                className="w-full border border-natural-border rounded-xl p-3 focus:ring-2 focus:ring-natural-accent outline-none text-sm"
              />
            </div>

            {localSettings.provider === 'openai-compatible' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-natural-text mb-2">
                  <Cpu size={16} className="text-natural-accent" />
                  模型名称 (Model)
                </label>
                <input 
                  value={localSettings.model}
                  onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
                  placeholder="deepseek-chat"
                  className="w-full border border-natural-border rounded-xl p-3 focus:ring-2 focus:ring-natural-accent outline-none text-sm"
                />
              </div>
            )}
          </div>

          <div className="bg-natural-bg p-4 rounded-2xl border border-natural-border">
            <p className="text-xs text-natural-muted leading-relaxed">
              <strong className="text-natural-accent">提示：</strong> 设置将安全地保存在您的本地浏览器中。如果您选择使用 DeepSeek，请确保填写正确的 Base URL 和 API Key。
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-natural-panel border-t border-natural-border flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-natural-muted hover:text-natural-text transition"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2.5 bg-natural-accent text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};
