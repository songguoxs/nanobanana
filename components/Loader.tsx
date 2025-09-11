import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "正在启动 AI 的创意回路...",
    "正在混合数字颜料和像素...",
    "正在咨询图像处理纳米精灵...",
    "正在应用变换... 这可能需要一些时间。",
    "快好了，正在进行最后的润色！",
];

export const Loader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 h-full">
      <svg
        className="animate-spin h-10 w-10 text-[var(--color-accent)]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="text-lg font-semibold text-[var(--color-text-primary)]">正在生成您的图片</p>
      <p className="text-[var(--color-text-secondary)] text-center transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};