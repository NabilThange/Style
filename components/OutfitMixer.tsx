import React, { useState, useEffect } from 'react';
import { ItemType, WardrobeItem, Outfit } from '../types';
import { Button } from './Button';
import { generateOutfitImage } from '../services/geminiService';
import { ChevronLeft, ChevronRight, Wand2, Loader2, Share2, AlertCircle, Crown, Zap, User } from 'lucide-react';

interface OutfitMixerProps {
  items: WardrobeItem[];
  outfits: Outfit[];
  onAddOutfit: (outfit: Outfit) => void;
  onUpdateOutfit: (id: string, updates: Partial<Outfit>) => void;
  initialModel?: string;
}

export const OutfitMixer: React.FC<OutfitMixerProps> = ({
  items,
  outfits,
  onAddOutfit,
  onUpdateOutfit,
  initialModel = 'gemini-2.5-flash-image'
}) => {
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);

  const [upperIndex, setUpperIndex] = useState(0);
  const [lowerIndex, setLowerIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const people = items.filter(i => i.type === ItemType.PERSON);
  const uppers = items.filter(i => i.type === ItemType.UPPER_WEAR);
  const lowers = items.filter(i => i.type === ItemType.LOWER_WEAR);

  useEffect(() => {
    if (people.length > 0 && !selectedPersonId) {
      setSelectedPersonId(people[0].id);
    }
  }, [people, selectedPersonId]);

  const currentPerson = people.find(p => p.id === selectedPersonId);
  const currentUpper = uppers[upperIndex];
  const currentLower = lowers[lowerIndex];

  const existingOutfit = currentPerson && currentUpper && currentLower
    ? outfits.find(o =>
      o.personId === currentPerson.id &&
      o.upperWearId === currentUpper.id &&
      o.lowerWearId === currentLower.id
    )
    : null;

  const nextUpper = () => setUpperIndex((prev) => (prev + 1) % uppers.length);
  const prevUpper = () => setUpperIndex((prev) => (prev - 1 + uppers.length) % uppers.length);
  const nextLower = () => setLowerIndex((prev) => (prev + 1) % lowers.length);
  const prevLower = () => setLowerIndex((prev) => (prev - 1 + lowers.length) % lowers.length);

  const handleGenerate = async () => {
    if (!currentPerson || !currentUpper || !currentLower) return;
    const newId = crypto.randomUUID();
    const newOutfit: Outfit = {
      id: newId,
      personId: currentPerson.id,
      upperWearId: currentUpper.id,
      lowerWearId: currentLower.id,
      status: 'generating',
      modelId: selectedModel,
      createdAt: Date.now()
    };
    onAddOutfit(newOutfit);
    setIsGenerating(true);
    try {
      const generatedImage = await generateOutfitImage(currentPerson, currentUpper, currentLower, selectedModel);
      onUpdateOutfit(newId, { status: 'completed', generatedImage });
    } catch (error) {
      console.error("Generation failed", error);
      onUpdateOutfit(newId, { status: 'failed' });
    } finally {
      setIsGenerating(false);
    }
  };

  if (people.length === 0 || uppers.length === 0 || lowers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl shadow-sm text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-6" />
        <h3 className="text-xl font-serif text-gray-900 mb-2">Collection Incomplete</h3>
        <p className="text-gray-500 text-sm max-w-sm">
          SwipeStyle™ requires at least one person, one upper wear, and one lower wear item.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-[3rem] font-black tracking-tighter text-gray-900 leading-none">SWIPESTYLE™</h2>

        <div className="flex gap-4">
          {/* Person Selector Pill */}
          <div className="relative group">
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-all border-2 border-transparent hover:border-[#F8D56C]">
              <User className="w-4 h-4 text-gray-400" />
              <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="appearance-none bg-transparent font-bold text-sm uppercase tracking-wide outline-none cursor-pointer pr-4 text-[#1A1A1A]"
              >
                {people.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Model Selector Pill */}
          <div className="relative group">
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-all border-2 border-transparent hover:border-[#F8D56C]">
              {selectedModel === 'gemini-3-pro-image-preview' ? (
                <Crown className="h-4 w-4 text-[#F8D56C]" />
              ) : (
                <Zap className="h-4 w-4 text-gray-400" />
              )}
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="appearance-none bg-transparent font-bold text-sm uppercase tracking-wide outline-none cursor-pointer pr-4 text-[#1A1A1A]"
              >
                <option value="gemini-2.5-flash-image">Gemini Flash</option>
                <option value="gemini-3-pro-image-preview">Gemini Pro</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* LEFT: Clothing Swipers */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upper Wear Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-4 left-6 text-xs font-bold uppercase tracking-widest text-gray-400">Upper Wear</div>

            <div className="mt-8 flex items-center justify-between">
              <button onClick={prevUpper} className="p-4 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>

              <div className="flex flex-col items-center">
                <div className="w-48 h-48 mb-4 relative">
                  <div className="absolute inset-0 bg-gray-50 rounded-full scale-90" />
                  {currentUpper && (
                    <img src={currentUpper.imageData} alt="" className="relative w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-500" />
                  )}
                </div>
                <h3 className="font-serif text-xl truncate max-w-[200px] text-center">{currentUpper?.name}</h3>
              </div>

              <button onClick={nextUpper} className="p-4 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {uppers.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === upperIndex ? 'bg-black' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          {/* Lower Wear Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-4 left-6 text-xs font-bold uppercase tracking-widest text-gray-400">Lower Wear</div>

            <div className="mt-8 flex items-center justify-between">
              <button onClick={prevLower} className="p-4 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>

              <div className="flex flex-col items-center">
                <div className="w-48 h-48 mb-4 relative">
                  <div className="absolute inset-0 bg-gray-50 rounded-full scale-90" />
                  {currentLower && (
                    <img src={currentLower.imageData} alt="" className="relative w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-500" />
                  )}
                </div>
                <h3 className="font-serif text-xl truncate max-w-[200px] text-center">{currentLower?.name}</h3>
              </div>

              <button onClick={nextLower} className="p-4 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {lowers.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === lowerIndex ? 'bg-black' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Main Stage (Generated Result) */}
        <div className="lg:col-span-7 h-full min-h-[600px] bg-white rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group">

          {existingOutfit && existingOutfit.status === 'completed' && existingOutfit.generatedImage ? (
            // GENERATED STATE
            <div className="w-full h-full relative">
              <img src={existingOutfit.generatedImage} className="w-full h-full object-cover" alt="Outfit" />

              <div className="absolute top-8 left-8">
                <span className="bg-[#F8D56C] text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  AI Generated
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex gap-4">
                  <Button variant="secondary" className="flex-1" icon={<Share2 className="w-4 h-4" />}>Share Look</Button>
                </div>
              </div>
            </div>
          ) : (
            // EMPTY / PREVIEW STATE
            <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
              {/* Background Decorative Ring like Landing Page */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square border border-gray-200 rounded-full -rotate-12 opacity-50 pointer-events-none" />

              {/* Ghost Composition */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-64 h-80 bg-gray-50 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden">
                  {/* Overlapping Previews */}
                  <div className="absolute inset-0 opacity-20">
                    {currentPerson && <img src={currentPerson.imageData} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="text-center p-6">
                    <h3 className="font-serif text-3xl italic text-gray-300">Future<br />Self</h3>
                  </div>
                </div>

                {existingOutfit?.status === 'generating' || isGenerating ? (
                  <Button disabled className="min-w-[200px] py-4 shadow-xl" variant="primary">
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Processing...
                  </Button>
                ) : existingOutfit?.status === 'failed' ? (
                  <Button onClick={handleGenerate} variant="danger" className="min-w-[200px]">
                    Retry Generation
                  </Button>
                ) : (
                  <Button onClick={handleGenerate} className="min-w-[240px] py-4 rounded-full bg-[#1A1A1A] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#F8D56C] hover:text-black transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                    GENERATE THIS OUTFIT
                  </Button>
                )}

                <p className="mt-4 text-gray-400 text-xs uppercase tracking-widest">
                  {existingOutfit?.status === 'generating' ? 'AI is crafting your look' : 'Ready to Visualize'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};