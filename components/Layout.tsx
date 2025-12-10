import React from 'react';
import { ScreenState } from '../types';
import { Shirt, Sparkles, LayoutGrid, Settings, Shuffle, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeScreen, onNavigate }) => {
  const navItems = [
    { id: 'wardrobe', label: 'My Wardrobe', icon: <Shirt className="w-5 h-5" /> },
    { id: 'mixer', label: 'SwipeStyle™', icon: <Shuffle className="w-5 h-5" /> },
    { id: 'generator', label: 'Generate', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'gallery', label: 'Favorites', icon: <LayoutGrid className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#E8EEF2] flex flex-col font-sans text-[#1A1A1A]">
      {/* Header */}
      <header className="bg-[#E8EEF2]/90 backdrop-blur-md border-b border-white/50 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <h1 className="text-3xl font-light tracking-[0.2em] uppercase font-serif">Style</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('settings')}
              className="p-2 text-gray-600 hover:text-black rounded-full hover:bg-white transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center border border-transparent shadow-sm">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex max-w-[1440px] mx-auto w-full relative gap-0">

        {/* Sidebar Navigation (Desktop) */}
        <div className="hidden md:block w-[280px] sticky top-20 h-[calc(100vh-80px)] p-6 pl-4 lg:pl-8 bg-white border-r border-[#E5E7EB] shrink-0">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ScreenState)}
                className={`flex items-center gap-3 w-full px-5 py-3.5 text-sm font-bold uppercase tracking-wide rounded-xl transition-all ${activeScreen === item.id
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-[#F3F4F6] hover:text-black'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-8 left-8">
            <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
              <LogOut className="w-4 h-4" />
              Exit App
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ScreenState)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeScreen === item.id ? 'text-black' : 'text-gray-400'
                }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};