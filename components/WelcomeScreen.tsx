import React from 'react';
import { SparklesIcon } from './Icons';

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
}

const suggestions = [
  {
    prompt: "一只戴着宇航员头盔的猫，数字艺术",
    bgClass: "bg-gradient-to-br from-purple-500 to-indigo-600",
  },
  {
    prompt: "一座漂浮在云层之上的未来城市，黄昏时分",
    bgClass: "bg-gradient-to-br from-orange-400 to-rose-500",
  },
  {
    prompt: "魔法森林中的发光蘑菇，细节丰富",
    bgClass: "bg-gradient-to-br from-teal-400 to-cyan-600",
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick }) => {
  return (
    <div className="text-center w-full h-full flex flex-col items-center justify-center animate-fade-in px-4 pb-16">
      <SparklesIcon className="w-16 h-16 mx-auto text-[var(--color-accent)]" />
      <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">开始您的创作</h2>
      <p className="mt-2 text-[var(--color-text-secondary)] max-w-lg mx-auto">输入提示词生成图片，或点击左下角上传图片进行编辑。</p>
      
      <div className="mt-12 w-full max-w-4xl">
        <h3 className="text-[var(--color-text-primary)] font-semibold mb-4">或者，试试这些示例：</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className={`relative aspect-[4/3] rounded-lg p-4 flex items-end text-left text-white overflow-hidden group transition-transform duration-300 ease-in-out hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] ${suggestion.bgClass}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
              <p className="relative z-10 font-medium text-base">{suggestion.prompt}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};