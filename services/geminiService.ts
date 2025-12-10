import { GoogleGenAI } from "@google/genai";
import { WardrobeItem, ImageSize } from "../types";

const SYSTEM_INSTRUCTION = `
You are a professional fashion photographer and digital editor AI. 
Your task is to generate photorealistic virtual try-on images.
You will receive images of a person, an upper wear item, and a lower wear item.
You must generate a new image of the person wearing these specific clothes.
Maintain the person's pose, body shape, skin tone, and facial features exactly.
Fit the clothing naturally onto the body, respecting realistic fabric physics, shadows, and draping.
The background should be neutral and clean (studio setting) unless the person's original background is complex, in which case keep it or blur it slightly.
Output ONLY the generated image.
`;

const cleanBase64 = (data: string) => data.replace(/^data:image\/\w+;base64,/, "");

export const generateOutfitImage = async (
  person: WardrobeItem,
  upper: WardrobeItem,
  lower: WardrobeItem,
  modelId: string = 'gemini-2.5-flash-image',
  imageSize: ImageSize = '1K'
): Promise<string> => {
  try {
    // Create client instance per request to ensure latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const personPart = {
      inlineData: {
        mimeType: "image/png",
        data: cleanBase64(person.imageData),
      },
    };

    const upperPart = {
      inlineData: {
        mimeType: "image/png",
        data: cleanBase64(upper.imageData),
      },
    };

    const lowerPart = {
      inlineData: {
        mimeType: "image/png",
        data: cleanBase64(lower.imageData),
      },
    };

    const promptText = {
      text: `Generate a photorealistic full-body image of the person (Image 1) wearing the Upper Wear (Image 2: ${upper.name} ${upper.color || ''}) and Lower Wear (Image 3: ${lower.name} ${lower.color || ''}). 
      Ensure the clothes fit naturally. 
      Person reference: Image 1.
      Upper Wear reference: Image 2.
      Lower Wear reference: Image 3.
      High quality, ${modelId === 'gemini-3-pro-image-preview' ? imageSize : ''}, fashion photography.`
    };

    // Configuration depends on model
    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
      imageConfig: {
        aspectRatio: "3:4"
      }
    };

    // Only Pro model supports imageSize configuration
    if (modelId === 'gemini-3-pro-image-preview') {
      config.imageConfig.imageSize = imageSize;
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [personPart, upperPart, lowerPart, promptText]
      },
      config: config
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in response");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const editWardrobeImage = async (
  item: WardrobeItem, 
  prompt: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const imagePart = {
      inlineData: {
        mimeType: "image/png",
        data: cleanBase64(item.imageData),
      },
    };

    const promptPart = {
      text: prompt
    };

    // Using gemini-2.5-flash-image for editing tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, promptPart]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};