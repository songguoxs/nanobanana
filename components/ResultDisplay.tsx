import React from 'react';
import { ZoomInIcon } from './Icons';

interface ResultDisplayProps {
  editedImageUrl: string | null;
  modelResponseText: string | null;
  onImagePreview: (url: string) => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ editedImageUrl, modelResponseText, onImagePreview }) => {

  return (
    <div className="animate-fade-in w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center text-[var(--color-text-primary)]">生成结果</h2>
        <div className="flex flex-col items-center justify-center gap-6 w-full">
            {editedImageUrl && (
                <div className="flex flex-col items-center justify-center w-full">
                    <button 
                        onClick={() => onImagePreview(editedImageUrl)}
                        className="relative group block"
                        aria-label="放大图片"
                    >
                        <img src={editedImageUrl} alt="生成结果" className="max-w-full max-h-[60vh] object-contain rounded-md" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md cursor-pointer">
                            <ZoomInIcon className="w-12 h-12 text-white" />
                        </div>
                    </button>
                </div>
            )}
            {modelResponseText && (
                <div className="w-full max-w-lg text-center p-4 bg-[var(--color-bg-primary)] rounded-lg">
                    <p className="text-[var(--color-text-secondary)] italic">"{modelResponseText}"</p>
                </div>
            )}
        </div>
    </div>
  );
};