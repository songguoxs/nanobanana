import React from 'react';
import { HistoryIcon, ThemeIcon } from './Icons';

interface HeaderProps {
    onHistoryClick: () => void;
    onNewSession: () => void;
    onThemeChange: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHistoryClick, onNewSession, onThemeChange }) => {
  return (
    <header className="bg-[var(--color-bg-primary-translucent)] backdrop-blur-sm border-b border-[var(--color-border)] sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-transparent bg-clip-text">
          Nano Banana体验版V1.0
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
            <button
                onClick={onNewSession}
                className="py-1 px-3 text-sm border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-md bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] transition-all duration-200 text-[var(--color-text-secondary)]"
            >
                新会话
            </button>
            <button 
                onClick={onHistoryClick} 
                className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-2 rounded-md hover:bg-[var(--color-bg-hover)]"
                aria-label="查看历史记录"
            >
                <HistoryIcon className="w-6 h-6" />
            </button>
             <button 
                onClick={onThemeChange} 
                className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-2 rounded-md hover:bg-[var(--color-bg-hover)]"
                aria-label="切换主题"
            >
                <ThemeIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </header>
  );
};