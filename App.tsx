
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptControls } from './components/PromptControls';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { HistoryModal } from './components/HistoryModal';
import { CloseIcon } from './components/Icons';
import { ImageUploader } from './components/ImageUploader';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Footer } from './components/Footer';
import { editImageWithNanoBanana, generateImage } from './services/geminiService';
import type { OriginalImage, EditedImageResult, HistoryItem } from './types';

const themes = [
    { name: 'Slate', colors: { 'bg-primary': '#0f172a', 'bg-secondary': '#1e293b', 'bg-tertiary': '#334155', 'bg-hover': 'rgba(71, 85, 105, 0.5)', 'bg-primary-translucent': 'rgba(15, 23, 42, 0.8)', 'text-primary': '#e2e8f0', 'text-secondary': '#94a3b8', 'text-placeholder': '#64748b', 'border': '#334155', 'accent': '#6366f1', 'accent-hover': '#818cf8', 'accent-text': '#ffffff', 'danger-bg': 'rgba(127, 29, 29, 0.5)', 'danger-border': '#7f1d1d', 'danger-text': '#fecaca', 'gradient-from': '#8b5cf6', 'gradient-to': '#6366f1' } },
    { name: 'Sky', colors: { 'bg-primary': '#f0f9ff', 'bg-secondary': '#ffffff', 'bg-tertiary': '#e0f2fe', 'bg-hover': 'rgba(224, 242, 254, 0.7)', 'bg-primary-translucent': 'rgba(240, 249, 255, 0.8)', 'text-primary': '#0c4a6e', 'text-secondary': '#38bdf8', 'text-placeholder': '#7dd3fc', 'border': '#bae6fd', 'accent': '#0ea5e9', 'accent-hover': '#38bdf8', 'accent-text': '#ffffff', 'danger-bg': 'rgba(254, 202, 202, 0.5)', 'danger-border': '#f87171', 'danger-text': '#b91c1c', 'gradient-from': '#38bdf8', 'gradient-to': '#0ea5e9' } },
    { name: 'Rose', colors: { 'bg-primary': '#260011', 'bg-secondary': '#40011d', 'bg-tertiary': '#590129', 'bg-hover': 'rgba(225, 29, 72, 0.3)', 'bg-primary-translucent': 'rgba(38, 0, 17, 0.8)', 'text-primary': '#fce7f3', 'text-secondary': '#f9a8d4', 'text-placeholder': '#f472b6', 'border': '#831843', 'accent': '#e11d48', 'accent-hover': '#f43f5e', 'accent-text': '#ffffff', 'danger-bg': 'rgba(159, 18, 57, 0.5)', 'danger-border': '#be123c', 'danger-text': '#fecdd3', 'gradient-from': '#f43f5e', 'gradient-to': '#e11d48' } },
    { name: 'Forest', colors: { 'bg-primary': '#052e16', 'bg-secondary': '#164e2a', 'bg-tertiary': '#15803d', 'bg-hover': 'rgba(34, 197, 94, 0.2)', 'bg-primary-translucent': 'rgba(5, 46, 22, 0.8)', 'text-primary': '#dcfce7', 'text-secondary': '#86efac', 'text-placeholder': '#4ade80', 'border': '#166534', 'accent': '#22c55e', 'accent-hover': '#4ade80', 'accent-text': '#052e16', 'danger-bg': 'rgba(127, 29, 29, 0.5)', 'danger-border': '#7f1d1d', 'danger-text': '#fecaca', 'gradient-from': '#4ade80', 'gradient-to': '#22c55e' } },
    { name: 'Royal', colors: { 'bg-primary': '#1c0f38', 'bg-secondary': '#2e1a5a', 'bg-tertiary': '#422580', 'bg-hover': 'rgba(252, 211, 77, 0.2)', 'bg-primary-translucent': 'rgba(28, 15, 56, 0.8)', 'text-primary': '#f5d0fe', 'text-secondary': '#e879f9', 'text-placeholder': '#d8b4fe', 'border': '#581c87', 'accent': '#facc15', 'accent-hover': '#fde047', 'accent-text': '#422006', 'danger-bg': 'rgba(127, 29, 29, 0.5)', 'danger-border': '#7f1d1d', 'danger-text': '#fecaca', 'gradient-from': '#e879f9', 'gradient-to': '#d8b4fe' } },
];


const App: React.FC = () => {
  const [originalImages, setOriginalImages] = useState<OriginalImage[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [placeholderPrompt, setPlaceholderPrompt] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<EditedImageResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [themeIndex, setThemeIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const hasImage = originalImages.length > 0;
  const showResult = !isLoading && !!currentResult?.imageUrl;

  const cycleTheme = useCallback(() => {
    setThemeIndex(prev => (prev + 1) % themes.length);
  }, []);

  const handleSuggestionsGenerated = useCallback((suggestions: { prompt: string }[]) => {
      if (suggestions.length > 0) {
        setPlaceholderPrompt(suggestions[0].prompt);
      }
  }, []);

  useEffect(() => {
    const theme = themes[themeIndex].colors;
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme)) {
      root.style.setProperty(`--color-${key}`, value);
    }
  }, [themeIndex]);

  useEffect(() => {
    if (showResult && resultRef.current) {
      const timer = setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentResult]); 

  const handleImageUpload = useCallback((newImages: Omit<OriginalImage, 'id'>[]) => {
    if (originalImages.length + newImages.length > 8) {
        setError("最多只能上传8张图片。");
        return;
    }

    const imagesWithIds: OriginalImage[] = newImages.map(img => ({
      ...img,
      id: crypto.randomUUID(),
    }));
    setOriginalImages(prev => [...prev, ...imagesWithIds]);
    setCurrentResult(null);
    setError(null);
  }, [originalImages.length]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (originalImages.length + files.length > 8) {
        setError("最多只能上传8张图片。");
        e.target.value = '';
        return;
    }

    // Fix: Explicitly type 'file' as File and reject with an Error object.
    const imagePromises: Promise<Omit<OriginalImage, 'id'>>[] = Array.from(files).map((file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            const base64String = reader.result.split(',')[1];
            resolve({
              base64: base64String,
              mimeType: file.type,
            });
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = (error) => reject(new Error('Error reading file: ' + error));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(imageData => {
        handleImageUpload(imageData);
    }).catch(err => {
        console.error(err);
        setError("读取文件时出错。");
    });
    
    e.target.value = '';
  }, [handleImageUpload, originalImages.length]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveImage = useCallback((idToRemove: string) => {
    setOriginalImages(prev => prev.filter(img => img.id !== idToRemove));
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      let result: EditedImageResult;
      
      if (originalImages.length > 0) {
        result = await editImageWithNanoBanana(
          originalImages.map(img => ({ base64: img.base64, mimeType: img.mimeType })),
          prompt
        );
      } else {
        result = await generateImage(prompt);
      }
      
      setCurrentResult(result);
      
      if (result.imageUrl) {
        const historyItem: HistoryItem = {
          id: crypto.randomUUID(),
          prompt,
          resultImageUrl: result.imageUrl,
          resultText: result.text,
          originalImages: originalImages.length > 0 ? originalImages : undefined,
          timestamp: new Date().toISOString(),
        };
        setHistory(prev => [historyItem, ...prev]);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发生未知错误。请查看控制台了解详情。';
      setError(`处理失败。 ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    setOriginalImages([]);
    setCurrentResult(null);
    setError(null);
    setPrompt('');
    setIsHistoryOpen(false);
  };

  const showUploaderOnly = hasImage && !isLoading && !currentResult?.imageUrl;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans flex flex-col transition-colors duration-500">
      <Header 
        onHistoryClick={() => setIsHistoryOpen(true)} 
        onNewSession={handleNewSession}
        onThemeChange={cycleTheme}
      />
      <main className="flex-grow container mx-auto px-4 pt-8 md:pt-12 w-full">
        {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger-text)] px-4 py-3 rounded-lg z-20 flex items-center gap-4" role="alert">
            <div className="flex-grow">
              <strong className="font-bold">错误：</strong>
              <span className="block sm:inline">{error}</span>
            </div>
            <button onClick={() => setError(null)} aria-label="关闭错误提示">
              <CloseIcon className="w-5 h-5" />
            </button>
        </div>
        )}

        {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
                <Loader />
            </div>
        ) : showResult ? (
              <div ref={resultRef} className="w-full max-w-4xl flex flex-col items-center gap-8 animate-fade-in pt-6 mx-auto">
                {hasImage && (
                    <div className="w-full">
                        <ImageUploader
                            images={originalImages}
                            onRemoveImage={handleRemoveImage}
                        />
                    </div>
                )}
                <ResultDisplay
                    editedImageUrl={currentResult.imageUrl!}
                    modelResponseText={currentResult.text}
                    onImagePreview={setPreviewImageUrl}
                />
            </div>
        ) : showUploaderOnly ? (
            <div className="my-6 animate-fade-in w-full">
                <ImageUploader
                    images={originalImages}
                    onRemoveImage={handleRemoveImage}
                />
            </div>
        ) : (
            <WelcomeScreen onSuggestionClick={setPrompt} onSuggestionsGenerated={handleSuggestionsGenerated} />
        )}
      </main>

      <PromptControls
        prompt={prompt}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        hasImage={hasImage}
        onUploadClick={handleUploadClick}
        placeholder={placeholderPrompt}
      />

      <Footer />
      
      <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          multiple
      />

      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={setSelectedHistoryItem}
      />
      
      {selectedHistoryItem && (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
            onClick={() => setSelectedHistoryItem(null)}
        >
            <div 
                className="bg-[var(--color-bg-secondary)] rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[var(--color-border)] m-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">历史记录详情</h3>
                    <button onClick={() => setSelectedHistoryItem(null)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">提示词:</p>
                        <p className="p-3 bg-[var(--color-bg-primary)] rounded-md text-[var(--color-text-secondary)] italic">"{selectedHistoryItem.prompt}"</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {selectedHistoryItem.originalImages && selectedHistoryItem.originalImages.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[var(--color-text-primary)]">原始图片</h4>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                    {selectedHistoryItem.originalImages.map(img => (
                                        <img key={img.id} src={`data:${img.mimeType};base64,${img.base64}`} alt="原始图片" className="rounded-md w-full object-cover aspect-square" />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className={`space-y-2 ${selectedHistoryItem.originalImages && selectedHistoryItem.originalImages.length > 0 ? '' : 'md:col-span-2'}`}>
                             <h4 className="font-semibold text-[var(--color-text-primary)]">生成结果</h4>
                            <img src={selectedHistoryItem.resultImageUrl} alt="生成结果" className="rounded-md w-full object-contain" />
                            {selectedHistoryItem.resultText && (
                                <p className="p-3 bg-[var(--color-bg-primary)] rounded-md text-[var(--color-text-secondary)] text-sm">
                                    <span className="font-semibold">模型回复: </span>"{selectedHistoryItem.resultText}"
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {previewImageUrl && (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
            onClick={() => setPreviewImageUrl(null)}
        >
            <div 
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
              <img src={previewImageUrl} alt="放大预览" className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg" />
              <button 
                onClick={() => setPreviewImageUrl(null)} 
                className="absolute -top-4 -right-4 text-white bg-[var(--color-bg-tertiary)] rounded-full p-2 hover:bg-[var(--color-bg-hover)] transition-colors"
                aria-label="关闭预览"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
