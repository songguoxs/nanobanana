import React, { useRef, useEffect } from 'react';
import { SendIcon, PlusIcon } from './Icons';

interface PromptControlsProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasImage: boolean;
  onUploadClick: () => void;
  placeholder?: string;
}

export const PromptControls: React.FC<PromptControlsProps> = ({
  prompt,
  onPromptChange,
  onSubmit,
  isLoading,
  hasImage,
  onUploadClick,
  placeholder,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      // 重置高度以重新计算
      textarea.style.height = 'auto'; 
      const scrollHeight = textarea.scrollHeight;
      // 设置为内容高度，由CSS中的max-height限制
      textarea.style.height = `${scrollHeight}px`; 
      // 调整大小后，滚动到底部以确保光标可见
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [prompt]);

  const getPlaceholder = () => {
    if(hasImage) return "例如：“把背景换成火星”，或“给所有图片加上赛博朋克风格”";
    return placeholder || "例如：“一只戴着宇航员头盔的猫”";
  }

  return (
    <div className="flex-shrink-0 px-4 w-full">
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative flex items-end p-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl shadow-2xl">
          <button
            onClick={onUploadClick}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] rounded-full transition-colors"
            aria-label="上传图片"
            disabled={isLoading}
          >
            <PlusIcon className="w-6 h-6" />
          </button>

          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isLoading && prompt.trim()) {
                  onSubmit();
                }
              }
            }}
            placeholder={getPlaceholder()}
            className="flex-grow mx-2 p-2 bg-transparent border-none focus:ring-0 transition-colors duration-200 text-[var(--color-text-primary)] placeholder-[var(--color-text-placeholder)] resize-none max-h-48"
            rows={1}
            disabled={isLoading}
            style={{overflowY: 'auto'}}
          />

          <button
            onClick={onSubmit}
            className="p-2 text-[var(--color-accent-text)] bg-[var(--color-accent)] rounded-full hover:bg-[var(--color-accent-hover)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !prompt.trim()}
            aria-label="发送提示词"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};