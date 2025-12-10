import React from 'react';
import { Outfit, WardrobeItem } from '../types';
import { Loader2, AlertTriangle, Check, RefreshCw, Trash2, Heart } from 'lucide-react';

interface OutfitGalleryProps {
  outfits: Outfit[];
  items: WardrobeItem[];
  onDeleteOutfit: (id: string) => void;
  onRetryOutfit: (id: string) => void;
}

export const OutfitGallery: React.FC<OutfitGalleryProps> = ({ outfits, items, onDeleteOutfit, onRetryOutfit }) => {
  const getOutfitDetails = (outfit: Outfit) => {
    const upper = items.find(i => i.id === outfit.upperWearId);
    const lower = items.find(i => i.id === outfit.lowerWearId);
    return { upper, lower };
  };

  const sortedOutfits = [...outfits].sort((a, b) => b.createdAt - a.createdAt);

  if (outfits.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-6">
           <Heart className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-xl font-serif text-gray-900">No Favorites Yet</h3>
        <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">Generate outfits and save them here to build your personal lookbook.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sortedOutfits.map((outfit) => {
        const { upper, lower } = getOutfitDetails(outfit);

        return (
          <div key={outfit.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden group flex flex-col">
            <div className="relative aspect-[3/4] bg-gray-50">
              {outfit.status === 'completed' && outfit.generatedImage ? (
                <img 
                  src={outfit.generatedImage} 
                  alt="Generated Outfit" 
                  className="w-full h-full object-cover" 
                />
              ) : outfit.status === 'generating' || outfit.status === 'pending' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#F8D56C]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {outfit.status === 'pending' ? 'Queued' : 'Rendering AI...'}
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400">
                  <AlertTriangle className="w-8 h-8 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Failed</span>
                  <button 
                     onClick={() => onRetryOutfit(outfit.id)}
                     className="mt-4 px-4 py-2 bg-white border border-red-100 rounded-full text-[10px] uppercase font-bold hover:bg-red-50 transition-colors"
                  >
                     Retry
                  </button>
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                  <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F8D56C]"></div>
                      <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-wide">
                        {upper?.name}
                      </p>
                  </div>
                  <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                      <p className="text-xs font-bold text-gray-500 truncate uppercase tracking-wide">
                        {lower?.name}
                      </p>
                  </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-300 uppercase tracking-widest font-mono">
                  <span>{new Date(outfit.createdAt).toLocaleDateString()}</span>
                  <span>IMG-3</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};