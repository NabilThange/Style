export enum ItemType {
  UPPER_WEAR = 'UPPER_WEAR',
  LOWER_WEAR = 'LOWER_WEAR',
  PERSON = 'PERSON',
}

export interface WardrobeItem {
  id: string;
  type: ItemType;
  imageData: string; // Base64
  name: string;
  category?: string;
  color?: string;
  notes?: string;
  createdAt: number;
}

export interface Outfit {
  id: string;
  personId: string;
  upperWearId: string;
  lowerWearId: string;
  generatedImage?: string; // Base64
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: number;
  imageSize?: ImageSize;
  modelId?: string;
}

export interface GenerationSettings {
  useHighQuality: boolean;
  aspectRatio: string;
}

export type ScreenState = 'landing' | 'wardrobe' | 'generator' | 'mixer' | 'gallery' | 'settings';

export type ImageSize = '1K' | '2K' | '4K';