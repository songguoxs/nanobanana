import React from 'react';
import type { HistoryItem } from '../types';
import { CloseIcon } from './Icons';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 animate-fade-in"
        onClick={onClose}
    >
        <div 
            className="bg-[var(--color-bg-secondary)] rounded-lg p-4 md:p-6 w-full max-w-5xl h-full md:max-h-[90vh] flex flex-col border border-[var(--color-border)] m-4"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">历史记录</h2>
                <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 -mr-4">
                {history.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-[var(--color-text-secondary)]">
                    <p>您生成的图片将会显示在这里。</p>
                </div>
                ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {history.map((item) => (
                    <button 
                        key={item.id} 
                        onClick={() => {
                            onSelect(item);
                            onClose();
                        }}
                        className="aspect-square bg-[var(--color-bg-tertiary)] rounded-md overflow-hidden group relative transition-transform hover:scale-105"
                    >
                        <img 
                        src={item.resultImageUrl} 
                        alt={item.prompt} 
                        className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <p className="text-white text-xs line-clamp-2">{item.prompt}</p>
                        </div>
                    </button>
                    ))}
                </div>
                )}
            </div>
        </div>
    </div>
  );
};