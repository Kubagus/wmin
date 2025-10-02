
import React, { useState, useEffect } from 'react';
import { WatermarkSettings, FilterType } from '../types.ts';
import { TrashIcon } from './icons/TrashIcon.tsx';
import { ChevronDownIcon } from './icons/ChevronDownIcon.tsx';
import { AddIcon } from './icons/AddIcon.tsx';

interface ControlPanelProps {
  settings: WatermarkSettings[];
  filter: FilterType;
  onAdd: () => void;
  onUpdate: <K extends keyof WatermarkSettings>(
    id: string,
    key: K,
    value: WatermarkSettings[K]
  ) => void;
  onRemove: (id: string) => void;
  onFilterChange: (filter: FilterType) => void;
}

const fonts = [
  { name: 'Inter', value: 'font-inter' },
  { name: 'Montserrat', value: 'font-montserrat' },
  { name: 'Lobster', value: 'font-lobster' },
  { name: 'Roboto Mono', value: 'font-roboto-mono' },
  { name: 'Playfair Display', value: 'font-playfair-display' },
];

const filters: { name: string; value: FilterType }[] = [
  { name: 'None', value: 'none' },
  { name: 'Grayscale', value: 'grayscale' },
  { name: 'Sepia', value: 'sepia' },
  { name: 'Invert', value: 'invert' },
];

const WatermarkEditor: React.FC<{
  setting: WatermarkSettings;
  onUpdate: ControlPanelProps['onUpdate'];
  isOpen: boolean;
}> = ({ setting, onUpdate, isOpen }) => {

  const handleSettingChange = <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => {
    onUpdate(setting.id, key, value);
  };
  
  if (!isOpen) return null;

  return (
    <div className="px-4 pb-4 pt-2 space-y-6">
       <div>
        <label htmlFor={`watermark-text-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
          Watermark Text
        </label>
        <input
          id={`watermark-text-${setting.id}`}
          type="text"
          value={setting.text}
          onChange={(e) => handleSettingChange('text', e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`text-color-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
            Color
          </label>
          <input
            id={`text-color-${setting.id}`}
            type="color"
            value={setting.color}
            onChange={(e) => handleSettingChange('color', e.target.value)}
            className="w-full h-10 bg-slate-700 border border-slate-600 rounded-md cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor={`font-family-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
            Font
          </label>
          <select
            id={`font-family-${setting.id}`}
            value={setting.fontFamily}
            onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
            className={`w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none ${setting.fontFamily}`}
          >
            {fonts.map((font) => (
              <option key={font.value} value={font.value} className={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor={`font-size-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
          Font Size: {setting.fontSize}px
        </label>
        <input
          id={`font-size-${setting.id}`}
          type="range"
          min="10"
          max="120"
          step="1"
          value={setting.fontSize}
          onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label htmlFor={`opacity-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
          Opacity: {Math.round(setting.opacity * 100)}%
        </label>
        <input
          id={`opacity-${setting.id}`}
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={setting.opacity}
          onChange={(e) => handleSettingChange('opacity', parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label htmlFor={`density-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
          Density: {setting.density}
        </label>
        <input
          id={`density-${setting.id}`}
          type="range"
          min="1"
          max="10"
          step="1"
          value={setting.density}
          onChange={(e) => handleSettingChange('density', parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label htmlFor={`rotation-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
          Rotation: {setting.rotation}°
        </label>
        <input
          id={`rotation-${setting.id}`}
          type="range"
          min="-90"
          max="90"
          step="5"
          value={setting.rotation}
          onChange={(e) => handleSettingChange('rotation', parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="space-y-4 border-t border-slate-600 pt-6 mt-6">
        <div className="flex justify-between items-center">
            <label htmlFor={`shadow-enabled-${setting.id}`} className="font-medium text-slate-300">
            Text Shadow
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                id={`shadow-enabled-${setting.id}`}
                checked={setting.shadowEnabled}
                onChange={(e) => handleSettingChange('shadowEnabled', e.target.checked)}
                className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>

        {setting.shadowEnabled && (
            <div className="space-y-6 pt-2">
                <div>
                    <label htmlFor={`shadow-color-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
                        Shadow Color
                    </label>
                    <input
                        id={`shadow-color-${setting.id}`}
                        type="color"
                        value={setting.shadowColor}
                        onChange={(e) => handleSettingChange('shadowColor', e.target.value)}
                        className="w-full h-10 bg-slate-700 border border-slate-600 rounded-md cursor-pointer"
                    />
                </div>
                 <div>
                    <label htmlFor={`shadow-blur-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
                    Shadow Blur: {setting.shadowBlur}px
                    </label>
                    <input
                        id={`shadow-blur-${setting.id}`}
                        type="range" min="0" max="30" step="1"
                        value={setting.shadowBlur}
                        onChange={(e) => handleSettingChange('shadowBlur', parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`shadow-offset-x-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
                        Offset X: {setting.shadowOffsetX}px
                        </label>
                        <input
                            id={`shadow-offset-x-${setting.id}`}
                            type="range" min="-30" max="30" step="1"
                            value={setting.shadowOffsetX}
                            onChange={(e) => handleSettingChange('shadowOffsetX', parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <label htmlFor={`shadow-offset-y-${setting.id}`} className="block text-sm font-medium text-slate-300 mb-2">
                        Offset Y: {setting.shadowOffsetY}px
                        </label>
                        <input
                            id={`shadow-offset-y-${setting.id}`}
                            type="range" min="-30" max="30" step="1"
                            value={setting.shadowOffsetY}
                            onChange={(e) => handleSettingChange('shadowOffsetY', parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};


const ControlPanel: React.FC<ControlPanelProps> = ({ settings, filter, onAdd, onUpdate, onRemove, onFilterChange }) => {
  const [openId, setOpenId] = useState<string | null>(settings[0]?.id || null);

  const toggleOpen = (id: string) => {
    setOpenId(prevId => (prevId === id ? null : id));
  };
  
  useEffect(() => {
    if (openId && !settings.some(s => s.id === openId)) {
      setOpenId(null);
    }
    if (settings.length === 1 && openId !== settings[0].id) {
        setOpenId(settings[0].id)
    }
  }, [settings, openId]);

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 space-y-4 shadow-2xl">
      <div className="space-y-2 border-b border-slate-700 pb-4">
        <h3 className="text-lg font-semibold text-white">Image Filter</h3>
        <div>
          <label htmlFor="filter-select" className="sr-only">Select a filter</label>
          <select
            id="filter-select"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value as FilterType)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {filters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {settings.map((setting) => (
          <div key={setting.id} className="bg-slate-700/50 rounded-md overflow-hidden">
            <button
              onClick={() => toggleOpen(setting.id)}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <span className="font-semibold truncate pr-2">{setting.text}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(setting.id);
                  }}
                  disabled={settings.length <= 1}
                  className="text-slate-400 hover:text-red-500 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                  aria-label="Remove watermark"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${openId === setting.id ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <WatermarkEditor
              setting={setting}
              onUpdate={onUpdate}
              isOpen={openId === setting.id}
            />
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600/50 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        <AddIcon />
        Add Text
      </button>
    </div>
  );
};

export default ControlPanel;
