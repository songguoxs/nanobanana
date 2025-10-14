
import { GoogleGenAI, Modality } from "@google/genai";
import type { EditedImageResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateImage(prompt: string): Promise<EditedImageResult> {
  try {
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("模型没有返回任何候选结果。");
    }
    
    const result: EditedImageResult = {
        imageUrl: null,
        text: null
    };

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        result.text = part.text;
      } else if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        result.imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    if (!result.imageUrl) {
        throw new Error("模型未能返回图片。请尝试不同的提示。");
    }

    return result;

  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    throw new Error(`Gemini API 请求失败。 ${error instanceof Error ? error.message : String(error)}`);
  }
}


export async function editImageWithNanoBanana(
  images: { base64: string; mimeType: string }[],
  prompt: string
): Promise<EditedImageResult> {
  try {
    const imageParts = images.map(image => ({
        inlineData: {
            data: image.base64,
            mimeType: image.mimeType,
        },
    }));

    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [...imageParts, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("模型没有返回任何候选结果。");
    }
    
    const result: EditedImageResult = {
        imageUrl: null,
        text: null
    };

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        result.text = part.text;
      } else if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        result.imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    if (!result.imageUrl && !result.text) {
        throw new Error("模型未能返回编辑后的图片或任何文本。请尝试不同的提示。");
    }

    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Gemini API 请求失败。 ${error instanceof Error ? error.message : String(error)}`);
  }
}
