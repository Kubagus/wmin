
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon.tsx';

interface UploaderProps {
  onImageUpload: (file: File) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files[0] && files[0].type.startsWith('image/')) {
      onImageUpload(files[0]);
    }
  }, [onImageUpload]);

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  return (
    <div className="w-full max-w-lg text-center">
      <label
        htmlFor="file-upload"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative block w-full rounded-lg border-2 border-dashed border-slate-600 p-12 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'bg-slate-700 border-indigo-500' : 'hover:border-slate-500'}`}
      >
        <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
        <span className="mt-2 block text-lg font-semibold text-white">
          Upload an image
        </span>
        <span className="mt-1 block text-sm text-slate-400">
          Drag & drop or click to select a file
        </span>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </label>
    </div>
  );
};

export default Uploader;