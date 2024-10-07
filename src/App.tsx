import React, { useState } from 'react';
import { ImageIcon, MessageSquare, Loader2 } from 'lucide-react';
import ImageGenerator from './components/ImageGenerator';
import TextGenerator from './components/TextGenerator';
import ImageGallery from './components/ImageGallery';
import { GeneratedImage, GeneratedText } from './types';

function App() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generatedTexts, setGeneratedTexts] = useState<GeneratedText[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');

  const handleImageGenerated = (newImage: GeneratedImage) => {
    setGeneratedImages((prevImages) => [newImage, ...prevImages]);
  };

  const handleTextGenerated = (newText: GeneratedText) => {
    setGeneratedTexts((prevTexts) => [newText, ...prevTexts]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <header className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
          <h1 className="text-4xl font-bold flex items-center justify-center">
            <ImageIcon className="mr-2" size={32} />
            我的AI工具箱
          </h1>
          <p className="mt-2 text-lg text-center">
            创建优质的图片，和优质的AI模型进行对话
          </p>
        </header>

        <div className="p-6">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'image'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ImageIcon className="inline-block mr-2" size={20} />
              创建图片
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'text'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <MessageSquare className="inline-block mr-2" size={20} />
              文字对话
            </button>
          </div>

          {activeTab === 'image' ? (
            <ImageGenerator
              onImageGenerated={handleImageGenerated}
              setIsLoading={setIsLoading}
            />
          ) : (
            <TextGenerator
              onTextGenerated={handleTextGenerated}
              setIsLoading={setIsLoading}
            />
          )}

          {isLoading && (
            <div className="flex justify-center items-center mt-8">
              <Loader2 className="animate-spin mr-2" size={24} />
              <span>Generating {activeTab}...</span>
            </div>
          )}

          {activeTab === 'image' && <ImageGallery images={generatedImages} />}
        </div>
      </div>
    </div>
  );
}

export default App;