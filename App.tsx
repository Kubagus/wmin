
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { WatermarkSettings, FilterType } from './types.ts';
import Header from './components/Header.tsx';
import ControlPanel from './components/ControlPanel.tsx';
import ImageCanvas from './components/ImageCanvas.tsx';
import Uploader from './components/Uploader.tsx';
import { DownloadIcon } from './components/icons/DownloadIcon.tsx';

const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [filter, setFilter] = useState<FilterType>('none');
  const [settings, setSettings] = useState<WatermarkSettings[]>([
    {
      id: Date.now().toString(),
      text: 'Your Watermark',
      color: '#ffffff',
      fontSize: 24,
      fontFamily: 'font-inter',
      opacity: 0.5,
      density: 3,
      rotation: -30,
      shadowEnabled: false,
      shadowColor: '#000000',
      shadowBlur: 5,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (file: File) => {
    setImage(file);
  };

  const handleDownload = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `watermarked-${image?.name || 'image.png'}`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }, [image]);

  const resetApp = () => {
    setImage(null);
    setFilter('none');
    setSettings([
      {
        id: Date.now().toString(),
        text: 'Your Watermark',
        color: '#ffffff',
        fontSize: 48,
        fontFamily: 'font-inter',
        opacity: 0.5,
        density: 3,
        rotation: -30,
        shadowEnabled: false,
        shadowColor: '#000000',
        shadowBlur: 5,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
      },
    ]);
  };
  
  const addWatermark = () => {
    const newWatermark: WatermarkSettings = {
      id: Date.now().toString(),
      text: 'New Text',
      color: '#ffffff',
      fontSize: 32,
      fontFamily: 'font-inter',
      opacity: 0.5,
      density: 2,
      rotation: -30,
      shadowEnabled: false,
      shadowColor: '#000000',
      shadowBlur: 5,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    };
    setSettings(prev => [...prev, newWatermark]);
  };

  const updateWatermark = <K extends keyof WatermarkSettings>(
    id: string,
    key: K,
    value: WatermarkSettings[K]
  ) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, [key]: value } : setting
      )
    );
  };

  const removeWatermark = (id: string) => {
    if (settings.length > 1) {
      setSettings(prev => prev.filter(setting => setting.id !== id));
    }
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <Header onReset={resetApp} hasImage={!!image} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        {image ? (
          <>
            <div className="lg:w-2/3 xl:w-3/4 bg-slate-800/50 rounded-lg p-4 flex items-center justify-center shadow-2xl">
              <ImageCanvas image={image} settings={settings} filter={filter} ref={canvasRef} />
            </div>
            <div className="lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
              <ControlPanel
                settings={settings}
                filter={filter}
                onAdd={addWatermark}
                onUpdate={updateWatermark}
                onRemove={removeWatermark}
                onFilterChange={handleFilterChange}
              />
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <DownloadIcon />
                Download Image
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex-grow flex items-center justify-center">
            <Uploader onImageUpload={handleImageUpload} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
