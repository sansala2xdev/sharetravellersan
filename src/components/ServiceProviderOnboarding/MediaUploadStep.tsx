'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

interface MediaUploadStepProps {
  data: {
    images: Array<{ file?: File; url: string; preview: string }>;
  };
  onChange: (data: any) => void;
}

export default function MediaUploadStep({ data, onChange }: MediaUploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError('');
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError('File size must be less than 5MB');
        return false;
      }
      return true;
    });

    const newImages = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      preview: URL.createObjectURL(file),
    }));

    onChange({
      ...data,
      images: [...data.images, ...newImages],
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    onChange({ ...data, images: newImages });
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...data.images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange({ ...data, images: newImages });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Media Upload</h2>
        <p className="text-gray-600">Add photos to showcase your service</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
          ${dragActive
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Drop images here or click to upload
        </h3>
        <p className="text-gray-600 mb-4">
          Support: JPG, PNG, GIF (Max 5MB per file)
        </p>
        <button
          type="button"
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
        >
          Select Images
        </button>
      </div>

      {/* Image Preview Guidelines */}
      <div className="bg-orange-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Photo Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>Upload at least 3-5 high-quality images</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>First image will be the cover photo in listings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>Show different angles and highlights of your service</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>Use well-lit, sharp images (avoid blurry photos)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>Include photos of the location, activities, and happy customers</span>
          </li>
        </ul>
      </div>

      {/* Image Gallery */}
      {data.images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Uploaded Images ({data.images.length})
            </h3>
            {data.images.length > 0 && (
              <p className="text-sm text-gray-600">
                Drag to reorder • First image is the cover
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all"
              >
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded z-10">
                    Cover
                  </div>
                )}
                
                <img
                  src={image.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    {index > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorder(index, index - 1);
                        }}
                        className="p-1 bg-white rounded shadow text-gray-700 hover:bg-gray-100"
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    {index < data.images.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorder(index, index + 1);
                        }}
                        className="p-1 bg-white rounded shadow text-gray-700 hover:bg-gray-100"
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.images.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No images uploaded yet</p>
          <p className="text-sm text-gray-400 mt-2">Upload at least 3 images to continue</p>
        </div>
      )}
    </div>
  );
}
