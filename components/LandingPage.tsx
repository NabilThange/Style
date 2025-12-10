import React from 'react';
import { ScreenState } from '../types';
import { Search, ShoppingBag, Heart, Camera, Bot, Shuffle, Archive } from 'lucide-react';

interface LandingPageProps {
    onNavigate: (screen: ScreenState) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-[#E8EEF2] font-sans text-gray-900 overflow-x-hidden selection:bg-[#F8D56C] selection:text-black flex flex-col">

            {/* Header - Fixed to match design */}
            <header className="px-6 py-6 flex items-center justify-between sticky top-0 z-50 bg-[#E8EEF2]/90 backdrop-blur-sm border-b border-transparent">
                {/* Left Nav */}
                <nav className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <button onClick={() => onNavigate('landing')} className="hover:text-black transition-colors relative group">
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                    </button>
                    <button onClick={() => onNavigate('wardrobe')} className="hover:text-black transition-colors relative group">
                        Wardrobe
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                    </button>
                    <button onClick={() => onNavigate('mixer')} className="hover:text-black transition-colors relative group">
                        Features
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                    </button>
                </nav>

                {/* Center Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 cursor-pointer" onClick={() => onNavigate('landing')}>
                    <h1 className="text-3xl font-light tracking-[0.2em] uppercase font-serif">Style</h1>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-6 text-gray-600">
                    <Search className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
                    <div className="relative cursor-pointer hover:text-black transition-colors" onClick={() => onNavigate('wardrobe')}>
                        <ShoppingBag className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>
                </div>
            </header>

            {/* Main Content - Vertical Layout */}
            <main className="flex-1 flex flex-col">

                {/* SECTION 1: HERO (Full Width) */}
                <div className="relative p-6 lg:p-12 flex flex-col w-full border-b border-gray-300/30 min-h-[85vh] lg:min-h-[90vh]">

                    {/* Hero Main Content */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center max-w-[1800px] mx-auto w-full">

                        {/* Giant Background Text */}
                        <div className="relative flex justify-center select-none pointer-events-none">
                            <h1 className="text-[12vw] lg:text-[11rem] xl:text-[13rem] leading-[0.8] font-black tracking-tighter text-gray-900/10 lg:text-gray-900/80 mix-blend-overlay text-center font-sans transform scale-y-110">
                                FUTURE OF<br />
                                WARDROBE
                            </h1>
                        </div>

                        {/* Central Floating Composition */}
                        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] lg:w-[35%] aspect-[3/4] pointer-events-none z-20">
                            {/* Floating Ring - Matching Reference */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] aspect-square border-[1.5px] border-white/60 rounded-full -rotate-12 transform scale-y-[0.25] opacity-80" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] aspect-square border-[1px] border-white/30 rounded-full -rotate-6 transform scale-y-[0.25] opacity-50" />

                            {/* Main 3D Item */}
                            <img
                                src="public/hero-main.png"
                                alt="Future Style"
                                className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-1000 ease-in-out filter saturate-110 contrast-110"
                                style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.25))' }}
                            />
                        </div>

                        {/* Bottom Right: Real Model (Sitting) */}
                        <div className="absolute bottom-12 right-0 lg:right-24 w-48 lg:w-80 z-10 hidden md:block group">
                            {/* Wave/Pedestal Graphic */}
                            <div className="absolute bottom-0 w-[120%] -left-[10%] h-32 bg-gray-400/20 backdrop-blur-md rounded-[100%] scale-y-50 transform translate-y-12 blur-xl"></div>
                            <img
                                src="/hero-main3.png"
                                alt="Model"
                                className="relative z-10 w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>

                        {/* Bottom Left: Floating Text Badge */}
                        <div className="absolute bottom-24 left-4 lg:left-24 z-10 hidden md:block animate-[spin_12s_linear_infinite]">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <svg className="w-full h-full text-[8px] tracking-[0.25em] uppercase font-bold text-gray-800" viewBox="0 0 100 100">
                                    <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
                                    <text>
                                        <textPath xlinkHref="#curve"> • Future of Style • AI Powered • 2024</textPath>
                                    </text>
                                </svg>
                                <div className="absolute inset-0 m-8 bg-gray-800 rounded-full flex items-center justify-center text-white">
                                    <Bot className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* CTA Button - Centered */}
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30">
                            <button
                                onClick={() => onNavigate('wardrobe')}
                                className="group relative px-16 py-4 bg-transparent border border-gray-600 rounded-full overflow-hidden transition-all hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-gray-200/50 backdrop-blur-sm -z-10 transition-colors group-hover:bg-[#1A1A1A]"></div>
                                <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 group-hover:text-white transition-colors">Get Started</span>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Strip: Features (Replacing Brands) */}
                    <div className="mt-auto pt-10 pb-2 border-t border-gray-400/20 w-full max-w-[1800px] mx-auto">
                        <div className="flex justify-between items-center px-4 gap-8 overflow-x-auto no-scrollbar">
                            {[
                                { text: 'Capture', icon: Camera },
                                { text: 'Generate', icon: Bot },
                                { text: 'Mix & Match', icon: Shuffle },
                                { text: 'Digital Closet', icon: Archive }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default whitespace-nowrap">
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-serif text-lg font-bold tracking-tight">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 2: WIDGETS (Grid Layout below Hero) */}
                <div className="w-full bg-[#E8EEF2] p-6 lg:p-16 border-t border-white/50">
                    <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Widget 1: Shop by Category (Digital Wardrobe) */}
                        <div onClick={() => onNavigate('wardrobe')} className="bg-[#D3DCE6] rounded-sm p-8 relative overflow-hidden group cursor-pointer hover:bg-[#c9d4e0] transition-colors min-h-[400px]">
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <h2 className="font-serif text-4xl italic text-gray-800 leading-none">
                                        Your Digital<br />
                                        <span className="not-italic font-sans font-light tracking-widest text-lg uppercase block mt-2">Wardrobe</span>
                                    </h2>
                                    <ul className="space-y-3 font-mono text-xs text-gray-600 mt-8">
                                        {['01 - Upper Wear', '02 - Lower Wear', '03 - Full Outfits', '04 - SwipeStyle™', '05 - Favorites'].map((item, idx) => (
                                            <li key={idx} className="border-b border-gray-400/20 pb-1 w-max group-hover:border-black transition-colors">{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Tilted Polaroid Effect */}
                                <div className="absolute -right-8 top-8 w-48 h-64 bg-white p-3 shadow-2xl rotate-12 group-hover:rotate-6 transition-transform duration-700 ease-out z-20">
                                    <div className="w-full h-[85%] bg-gray-200 overflow-hidden mb-2 relative">
                                        <img src="/The Masked Figure.png" className="w-full h-full object-cover filter contrast-125" alt="Polaroid" />
                                    </div>
                                    <div className="text-[8px] font-mono text-center text-gray-400">wardrobe_v1.jpg</div>
                                </div>

                                {/* Decorative Frame Line */}
                                <div className="absolute inset-4 border border-white/40 pointer-events-none" />
                            </div>
                        </div>

                        {/* Widget 2: Lookbook (See Yourself) */}
                        <div onClick={() => onNavigate('generator')} className="bg-[#E0E5EB] rounded-sm p-8 relative min-h-[400px] flex flex-col justify-between group overflow-hidden cursor-pointer">
                            <div className="relative z-10">
                                <h2 className="font-serif text-3xl text-gray-800 leading-tight">
                                    See Yourself<br />
                                    <span className="italic font-light text-2xl">in every outfit</span>
                                </h2>
                            </div>

                            {/* Mannequins/Models */}
                            <div className="flex justify-center items-end gap-2 absolute bottom-0 right-0 w-full h-[70%]">
                                <img src="/Abstract Dissolving Figure.png" className="h-[90%] w-auto object-cover mix-blend-multiply opacity-60 grayscale" alt="Silhouette 1" />
                                <img src="/Futuristic Fashion in Red Corridor.png" className="h-full w-auto object-cover mix-blend-normal z-10 shadow-xl" alt="Main Model" />
                                <img src="/Surreal Portrait Art.png" className="h-[80%] w-auto object-cover mix-blend-multiply opacity-60 grayscale" alt="Silhouette 2" />
                            </div>

                            {/* Oval Button */}
                            <div className="relative z-20 mt-auto">
                                <button className="px-6 py-2 border border-gray-600 rounded-[50%] text-[10px] uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all">
                                    Try It Now
                                </button>
                            </div>

                            {/* Background Rings */}
                            <div className="absolute right-0 bottom-0 w-64 h-64 border border-white/50 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Widget 3: Best Collections (How It Works Grid) */}
                        <div className="bg-white rounded-sm p-8 shadow-sm min-h-[400px] flex flex-col">
                            <div className="flex justify-between items-baseline mb-8">
                                <h2 className="font-serif text-2xl font-medium">How It Works</h2>
                                <span className="text-xs font-bold text-gray-400 cursor-pointer hover:text-black">GUIDE &rarr;</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 flex-1">
                                {[
                                    { name: 'Upload', meta: 'Clothes', img: '/Surreal Portrait Art.png' },
                                    { name: 'Generate', meta: 'AI Magic', img: '/Abstract Dissolving Figure.png' }
                                ].map((item, i) => (
                                    <div key={i} className="group cursor-pointer flex flex-col">
                                        <div className="relative flex-1 bg-gray-100 mb-3 overflow-hidden">
                                            <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt={item.name} />
                                            <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full">
                                                <Heart className="w-3 h-3 text-gray-400" />
                                            </div>
                                        </div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider">{item.name}</h3>
                                        <p className="text-[10px] text-gray-500 font-mono">{item.meta}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </main>

            {/* Footer / Developer Credits */}
            <footer className="bg-[#E8EEF2] border-t border-gray-300 py-8 text-center text-xs text-gray-500 font-mono">
                <p>Developed by Nabil Salim Thange • <a href="https://nabil-thange.vercel.app/" className="hover:text-black underline">Portfolio</a> • Powered by Google Gemini</p>
            </footer>
        </div>
    );
};