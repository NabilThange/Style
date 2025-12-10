import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Wardrobe } from './components/Wardrobe';
import { OutfitGenerator } from './components/OutfitGenerator';
import { OutfitMixer } from './components/OutfitMixer';
import { OutfitGallery } from './components/OutfitGallery';
import { LandingPage } from './components/LandingPage';
import { ScreenState, WardrobeItem, Outfit } from './types';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenState>('landing');
  const [preferredModel, setPreferredModel] = useState<string>('gemini-2.5-flash-image');

  // App State
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  const handleAddItem = (item: WardrobeItem) => {
    setWardrobeItems(prev => [...prev, item]);
  };

  const handleRemoveItem = (id: string) => {
    setWardrobeItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddOutfit = (outfit: Outfit) => {
    setOutfits(prev => [...prev, outfit]);
  };

  const handleUpdateOutfit = (id: string, updates: Partial<Outfit>) => {
    setOutfits(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const handleDeleteOutfit = (id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id));
  };

  const handleRetryOutfit = (id: string) => {
    handleDeleteOutfit(id);
    setActiveScreen('generator');
  };

  // If on landing page, render full screen without app layout
  if (activeScreen === 'landing') {
    return <LandingPage onNavigate={setActiveScreen} />;
  }

  // App Internal Screens
  const renderScreen = () => {
    switch (activeScreen) {
      case 'wardrobe':
        return (
          <Wardrobe
            items={wardrobeItems}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
        );
      case 'mixer':
        return (
          <OutfitMixer
            items={wardrobeItems}
            outfits={outfits}
            onAddOutfit={handleAddOutfit}
            onUpdateOutfit={handleUpdateOutfit}
            initialModel={preferredModel}
          />
        );
      case 'generator':
        return (
          <OutfitGenerator
            items={wardrobeItems}
            outfits={outfits}
            onAddOutfit={handleAddOutfit}
            onUpdateOutfit={handleUpdateOutfit}
            initialModel={preferredModel}
          />
        );
      case 'gallery':
        return (
          <OutfitGallery
            outfits={outfits}
            items={wardrobeItems}
            onDeleteOutfit={handleDeleteOutfit}
            onRetryOutfit={handleRetryOutfit}
          />
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-700">Google API Status</span>
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Ready
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-700">Clear All Data</span>
                <button
                  onClick={() => {
                    if (confirm('Are you sure? This will delete all clothes and generated images.')) {
                      setWardrobeItems([]);
                      setOutfits([]);
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Reset App
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                StyleSync v1.3 • Powered by Gemini
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <HashRouter>
      <Layout activeScreen={activeScreen} onNavigate={setActiveScreen}>
        {/* Desktop Sidebar Adjuster Wrapper removed - Layout handles flex */}
        {renderScreen()}
      </Layout>
    </HashRouter>
  );
};

export default App;