import React, { useState, useRef } from 'react';
import { ItemType, WardrobeItem } from '../types';
import { ITEM_TYPE_LABELS } from '../constants';
import { Button } from './Button';
import { Plus, Trash2, Camera, X, Wand2, Loader2, Heart, Image as ImageIcon, RotateCcw, Check } from 'lucide-react';
import { editWardrobeImage } from '../services/geminiService';

interface WardrobeProps {
    items: WardrobeItem[];
    onAddItem: (item: WardrobeItem) => void;
    onRemoveItem: (id: string) => void;
}

export const Wardrobe: React.FC<WardrobeProps> = ({ items, onAddItem, onRemoveItem }) => {
    const [activeTab, setActiveTab] = useState<ItemType>(ItemType.UPPER_WEAR);
    const [isAdding, setIsAdding] = useState(false);

    // Edit State
    const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
    const [editPrompt, setEditPrompt] = useState('');
    const [isEditingProcessing, setIsEditingProcessing] = useState(false);

    // Form State
    const [newItemName, setNewItemName] = useState('');
    const [newItemImage, setNewItemImage] = useState<string | null>(null);

    /* Camera & Modal State */
    const [showUploadMethod, setShowUploadMethod] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredItems = items.filter(item => item.type === activeTab);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItemImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = () => {
        if (!newItemImage) return;

        const newItem: WardrobeItem = {
            id: crypto.randomUUID(),
            type: activeTab,
            imageData: newItemImage,
            name: newItemName || `${ITEM_TYPE_LABELS[activeTab]} ${items.length + 1}`,
            createdAt: Date.now(),
        };

        onAddItem(newItem);
        resetForm();
    };

    const resetForm = () => {
        setIsAdding(false);
        setNewItemName('');
        setNewItemImage(null);
        setShowUploadMethod(false);
        stopCamera();
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setCameraStream(stream);
            setIsCameraOpen(true);
            setShowUploadMethod(false);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow camera permissions.");
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');

                // Set image and go to add form
                setNewItemImage(dataUrl);
                stopCamera();
                setIsAdding(true);
            }
        }
    };

    const handleEditSubmit = async () => {
        if (!editingItem || !editPrompt) return;

        setIsEditingProcessing(true);
        try {
            const newImageData = await editWardrobeImage(editingItem, editPrompt);

            const newItem: WardrobeItem = {
                id: crypto.randomUUID(),
                type: editingItem.type,
                imageData: newImageData,
                name: `${editingItem.name} (Edited)`,
                notes: `Edited with prompt: ${editPrompt}`,
                createdAt: Date.now(),
            };

            onAddItem(newItem);
            setEditingItem(null);
            setEditPrompt('');
        } catch (error) {
            alert('Failed to edit image. Please try again.');
        } finally {
            setIsEditingProcessing(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Category Navigation */}
            <div className="flex gap-4 mb-4 bg-white p-2 rounded-full w-fit overflow-x-auto max-w-full shadow-sm">
                {(Object.values(ItemType) as ItemType[]).map((type) => (
                    <button
                        key={type}
                        onClick={() => {
                            setActiveTab(type);
                            setIsAdding(false);
                        }}
                        className={`py-3 px-8 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === type
                            ? 'bg-[#1A1A1A] text-white shadow-md'
                            : 'text-[#6B7280] bg-transparent hover:bg-[#F3F4F6]'
                            }`}
                    >
                        {ITEM_TYPE_LABELS[type]}
                    </button>
                ))}
            </div>

            {!isAdding ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Add New Card */}
                    <button
                        onClick={() => setShowUploadMethod(true)}
                        className="aspect-[3/4] bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)] transition-all border-2 border-transparent hover:border-[#F8D56C] hover:-translate-y-1 flex flex-col items-center justify-center text-gray-400 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-[#F8D56C] flex items-center justify-center mb-4 transition-colors">
                            <Camera className="w-8 h-8 group-hover:text-black" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-900 group-hover:text-black">Add {activeTab === ItemType.PERSON ? 'Profile' : 'Item'}</span>
                    </button>

                    {/* Existing Items */}
                    {filteredItems.map((item) => (
                        <div key={item.id} className="relative group aspect-[3/4] bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all overflow-hidden border border-transparent hover:border-gray-100">
                            <div className="w-full h-full p-4 pb-12">
                                <img src={item.imageData} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>

                            {/* Actions Overlay */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => setEditingItem(item)}
                                    className="p-2 bg-white rounded-full text-gray-600 hover:text-indigo-600 shadow-sm border border-gray-100"
                                    title="AI Edit"
                                >
                                    <Wand2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="p-2 bg-white rounded-full text-gray-600 hover:text-red-600 shadow-sm border border-gray-100"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Bottom Info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 flex justify-between items-center z-10">
                                <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-wide">{item.name}</p>
                                <Heart className="w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer transition-colors" />
                            </div>
                        </div>
                    ))}

                    {filteredItems.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400">
                            <p className="font-serif italic text-xl">Empty Collection</p>
                            <p className="text-xs uppercase tracking-widest mt-2">Add items to start building your wardrobe</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-serif">Add New {ITEM_TYPE_LABELS[activeTab]}</h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-black">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div className="flex flex-col items-center">
                            {!newItemImage ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-80 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#F8D56C] hover:bg-gray-50 transition-all"
                                >
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                        <Camera className="w-10 h-10" />
                                    </div>
                                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Click to upload photo</p>
                                    <p className="text-xs text-gray-400 mt-2 font-mono">JPG, PNG supported</p>
                                </div>
                            ) : (
                                <div className="relative w-full h-80 rounded-xl overflow-hidden group bg-gray-50">
                                    <img src={newItemImage} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
                                    <button
                                        onClick={() => setNewItemImage(null)}
                                        className="absolute top-4 right-4 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                Item Name
                            </label>
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder={`e.g., ${activeTab === ItemType.UPPER_WEAR ? 'Blue Denim Jacket' : activeTab === ItemType.LOWER_WEAR ? 'Black Jeans' : 'Me - Casual Pose'}`}
                                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button variant="secondary" onClick={resetForm} className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleAddItem}
                                disabled={!newItemImage}
                                className="flex-1"
                                icon={<Plus className="w-4 h-4" />}
                            >
                                Save to Wardrobe
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Method Modal */}
            {showUploadMethod && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] max-w-md w-full overflow-hidden p-6 relative">
                        <button
                            onClick={() => setShowUploadMethod(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="font-serif text-xl font-medium mb-6 text-center">Choose Upload Method</h3>

                        <div className="space-y-4">
                            <button
                                onClick={startCamera}
                                className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-full hover:border-[#F8D56C] hover:bg-yellow-50/10 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#F8D56C] transition-colors">
                                    <Camera className="w-5 h-5 text-gray-600 group-hover:text-black" />
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold text-sm">Take Photo</span>
                                    <span className="text-xs text-gray-500">Open camera and capture now</span>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setShowUploadMethod(false);
                                    setIsAdding(true);
                                }}
                                className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-full hover:border-[#F8D56C] hover:bg-yellow-50/10 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#F8D56C] transition-colors">
                                    <ImageIcon className="w-5 h-5 text-gray-600 group-hover:text-black" />
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold text-sm">Upload from Gallery</span>
                                    <span className="text-xs text-gray-500">Choose existing photo</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Camera Interface */}
            {isCameraOpen && (
                <div className="fixed inset-0 bg-black z-[60] flex flex-col">
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                        <button onClick={stopCamera} className="text-white flex items-center gap-2">
                            <X className="w-6 h-6" />
                            <span className="text-sm font-medium">Close</span>
                        </button>
                        <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Live Camera</div>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            onLoadedMetadata={() => videoRef.current?.play()}
                            className="w-full h-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Guide Text Overlay */}
                        <div className="absolute bottom-32 left-0 right-0 text-center pointer-events-none px-6">
                            <p className="text-white/90 text-sm font-medium bg-black/20 backdrop-blur-md inline-block px-4 py-2 rounded-full">
                                Position item flat, well-lit, neutral background
                            </p>
                        </div>
                    </div>

                    <div className="h-28 bg-black flex items-center justify-center gap-12 pb-6">
                        <button
                            onClick={capturePhoto}
                            className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                        >
                            <div className="w-14 h-14 rounded-full border-2 border-black"></div>
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="font-serif text-xl">AI Magic Edit</h3>
                            <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
                                <img src={editingItem.imageData} alt="Original" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Instruction
                                </label>
                                <textarea
                                    value={editPrompt}
                                    onChange={(e) => setEditPrompt(e.target.value)}
                                    placeholder="Turn it red, remove logo, make it vintage..."
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all h-24 resize-none"
                                />
                            </div>
                            <Button
                                onClick={handleEditSubmit}
                                disabled={!editPrompt.trim() || isEditingProcessing}
                                className="w-full"
                                variant="accent"
                                icon={isEditingProcessing ? <Loader2 className="animate-spin" /> : <Wand2 className="w-4 h-4" />}
                            >
                                {isEditingProcessing ? 'Processing...' : 'Apply Magic'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};