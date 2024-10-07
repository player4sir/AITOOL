import React, { useState } from 'react';
import { Download, X, AlertCircle } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageGalleryProps {
  images: GeneratedImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (images.length === 0) {
    return null;
  }

  const handleDownload = (image: GeneratedImage) => {
    try {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `${image.prompt.slice(0, 20)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      setError('Failed to download image. Please try again.');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Generated Images</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={image.url} 
              alt={image.prompt} 
              className="w-full h-48 object-cover cursor-pointer" 
              onClick={() => setPreviewImage(image)}
            />
            <div className="p-4">
              <p className="text-sm text-gray-600 truncate mb-2">{image.prompt}</p>
              <button
                onClick={() => handleDownload(image)}
                className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-end mb-2">
              <button onClick={() => setPreviewImage(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <img src={previewImage.url} alt={previewImage.prompt} className="max-w-full max-h-[70vh] object-contain" />
            <p className="mt-4 text-sm text-gray-600">{previewImage.prompt}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;