export interface OriginalImage {
  id: string;
  base64: string;
  mimeType: string;
}

export interface EditedImageResult {
  imageUrl: string | null;
  text: string | null;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  resultImageUrl: string;
  resultText: string | null;
  originalImages?: OriginalImage[];
  timestamp: string; // ISO string
}