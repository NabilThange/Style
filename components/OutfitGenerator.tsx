import React, { useState, useEffect } from 'react';
import { ItemType, WardrobeItem, Outfit, ImageSize } from '../types';
import { Button } from './Button';
import { generateOutfitImage } from '../services/geminiService';
import { Sparkles, Loader2, AlertCircle, Zap, Crown } from 'lucide-react';

interface OutfitGeneratorProps {
  items: WardrobeItem[];
  outfits: Outfit[];
  onAddOutfit: (outfit: Outfit) => void;
  onUpdateOutfit: (id: string, updates: Partial<Outfit>) => void;
  initialModel?: string;
}

export const OutfitGenerator: React.FC<OutfitGeneratorProps> = ({ 
  items, 
  outfits, 
  onAddOutfit, 
  onUpdateOutfit,
  initialModel = 'gemini-2.5-flash-image'
}) => {
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<ImageSize>('1K');
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationQueue, setGenerationQueue] = useState<Outfit[]>([]);

  const people = items.filter(i => i.type === ItemType.PERSON);
  const uppers = items.filter(i => i.type === ItemType.UPPER_WEAR);
  const lowers = items.filter(i => i.type === ItemType.LOWER_WEAR);

  useEffect(() => {
    if (people.length > 0 && !selectedPersonId) {
      setSelectedPersonId(people[0].id);
    }
  }, [people, selectedPersonId]);

  useEffect(() => {
      setSelectedModel(initialModel);
  }, [initialModel]);

  const calculateCombinations = () => {
    if (!selectedPersonId || uppers.length === 0 || lowers.length === 0) return [];
    
    const combinations: Omit<Outfit, 'id' | 'createdAt' | 'status'>[] = [];
    uppers.forEach(upper => {
      lowers.forEach(lower => {
        const exists = outfits.some(
          o => o.personId === selectedPersonId && 
               o.upperWearId === upper.id && 
               o.lowerWearId === lower.id
        );
        if (!exists) {
            combinations.push({
                personId: selectedPersonId,
                upperWearId: upper.id,
                lowerWearId: lower.id,
            });
        }
      });
    });
    return combinations;
  };

  const pendingCombinations = calculateCombinations();

  const handleStartGeneration = async () => {
    if (pendingCombinations.length === 0) return;
    const newOutfits: Outfit[] = pendingCombinations.map(c => ({
      ...c,
      id: crypto.randomUUID(),
      status: 'pending',
      imageSize: selectedSize,
      modelId: selectedModel,
      createdAt: Date.now()
    }));
    newOutfits.forEach(o => onAddOutfit(o));
    setGenerationQueue(newOutfits);
    setIsGenerating(true);
  };

  useEffect(() => {
    const processQueue = async () => {
      if (!isGenerating || generationQueue.length === 0) {
        setIsGenerating(false);
        return;
      }
      const currentOutfit = generationQueue[0];
      try {
        onUpdateOutfit(currentOutfit.id, { status: 'generating' });
        const person = items.find(i => i.id === currentOutfit.personId);
        const upper = items.find(i => i.id === currentOutfit.upperWearId);
        const lower = items.find(i => i.id === currentOutfit.lowerWearId);
        if (!person || !upper || !lower) throw new Error("Missing source items");
        
        const generatedImage = await generateOutfitImage(person, upper, lower, currentOutfit.modelId || selectedModel, currentOutfit.imageSize || '1K');
        onUpdateOutfit(currentOutfit.id, { status: 'completed', generatedImage });
      } catch (error) {
        console.error("Failed to generate outfit", error);
        onUpdateOutfit(currentOutfit.id, { status: 'failed' });
      } finally {
        setGenerationQueue(prev => prev.slice(1));
      }
    };
    if (isGenerating) processQueue();
  }, [isGenerating, generationQueue]);

  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Missing Profile</h3>
        <p className="text-gray-500 max-w-sm mt-2">
          Add a "Person Profile" photo in your wardrobe first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Config Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div>
            <h2 className="text-3xl font-serif text-gray-900 mb-2">Batch Generator</h2>
            <p className="text-sm text-gray-500 max-w-md">
              Automatically generate every possible combination from your selected items.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
             <div className="w-full">
                 <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">AI Model</label>
                 <div className="relative">
                   <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="block w-full rounded-lg bg-gray-50 border-transparent py-3 pl-10 pr-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-black"
                  >
                      <option value="gemini-2.5-flash-image">Flash (Free)</option>
                      <option value="gemini-3-pro-image-preview">Pro (Paid)</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     {selectedModel === 'gemini-3-pro-image-preview' ? (
                        <Crown className="h-4 w-4 text-[#F8D56C]" />
                     ) : (
                        <Zap className="h-4 w-4 text-gray-400" />
                     )}
                  </div>
                 </div>
             </div>

             <div className="w-full">
                 <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Resolution</label>
                 <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value as ImageSize)}
                    disabled={selectedModel === 'gemini-2.5-flash-image'}
                    className={`block w-full rounded-lg py-3 px-4 text-sm font-bold border-transparent ${selectedModel === 'gemini-2.5-flash-image' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black'}`}
                >
                    <option value="1K">1K Standard</option>
                    <option value="2K">2K High Res</option>
                    <option value="4K">4K Ultra</option>
                </select>
             </div>
             
             <div className="w-full">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Profile</label>
                <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="block w-full rounded-lg bg-gray-50 border-transparent py-3 px-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-black"
                >
                {people.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
                </select>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
            <div className="text-center">
                <div className="text-3xl font-black text-gray-900">{uppers.length}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Upper Items</div>
            </div>
            <div className="text-center border-l border-gray-100">
                <div className="text-3xl font-black text-gray-900">{lowers.length}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Lower Items</div>
            </div>
            <div className="text-center border-l border-gray-100">
                <div className="text-3xl font-black text-[#F8D56C] drop-shadow-sm">
                    {pendingCombinations.length}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">New Looks</div>
            </div>
        </div>

        <div className="mt-8">
            <Button
                onClick={handleStartGeneration}
                disabled={isGenerating || pendingCombinations.length === 0}
                className="w-full py-4 text-base shadow-xl"
                variant="primary"
                icon={isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
            >
                {isGenerating 
                    ? `Generating... (${generationQueue.length} remaining)` 
                    : `Generate ${pendingCombinations.length} Outfits`}
            </Button>
        </div>
      </div>

      {/* Preview Queue */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm ml-2">Queue Preview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingCombinations.slice(0, 6).map((combo, idx) => {
                const upper = items.find(i => i.id === combo.upperWearId);
                const lower = items.find(i => i.id === combo.lowerWearId);
                return (
                    <div key={idx} className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-50 gap-4 items-center">
                        <div className="flex -space-x-3">
                             <img src={upper?.imageData} className="w-10 h-10 rounded-full border-2 border-white object-cover bg-gray-50" alt="" />
                             <img src={lower?.imageData} className="w-10 h-10 rounded-full border-2 border-white object-cover bg-gray-50" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate uppercase">{upper?.name}</p>
                            <p className="text-[10px] text-gray-500 truncate font-mono">+ {lower?.name}</p>
                        </div>
                    </div>
                );
            })}
             {pendingCombinations.length > 6 && (
                 <div className="flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-widest p-4">
                     + {pendingCombinations.length - 6} more
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};