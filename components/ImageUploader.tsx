import React from 'react';
import { CloseIcon } from './Icons';
import type { OriginalImage } from '../types';

interface ImageUploaderProps {
  images: OriginalImage[];
  onRemoveImage: (id: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  images, 
  onRemoveImage 
}) => {
  return (
    <div className="w-full max-w-4xl">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3 text-left">已上传图片 ({images.length}/8)</h2>
        <div className="flex justify-start flex-wrap gap-4">
            {images.map(image => (
                <div key={image.id} className="relative group">
                    <div
                        className={`w-24 h-24 bg-[var(--color-bg-tertiary)] rounded-md overflow-hidden ring-2 ring-[var(--color-border)]`}
                    >
                        <img src={`data:${image.mimeType};base64,${image.base64}`} alt="预览" className="w-full h-full object-cover" />
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRemoveImage(image.id); }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="移除图片"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};