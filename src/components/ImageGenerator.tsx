import React, { useState, useEffect, useCallback } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageGeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated, setIsLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [model, setModel] = useState('flux');
  const [models, setModels] = useState<string[]>([]);
  const [seed, setSeed] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://image.pollinations.ai/models')
      .then(response => response.json())
      .then(data => setModels(data))
      .catch(error => {
        console.error('Error fetching image models:', error);
        setError('Failed to load image models. Please try again later.');
      });
  }, []);

  const generateImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=${model}&seed=${seed}&nologo=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      onImageGenerated({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        prompt,
      });
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, width, height, model, seed, onImageGenerated, setIsLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setSeed(Math.floor(Math.random() * 1000000));
    generateImage();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your image description..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Width</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {models.map((modelName) => (
              <option key={modelName} value={modelName}>{modelName}</option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}
      <button
        type="submit"
        className="w-full flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={!prompt.trim()}
      >
        <Send size={16} className="mr-2" />
        生成图片
      </button>
    </form>
  );
};

export default ImageGenerator;