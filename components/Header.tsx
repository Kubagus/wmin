import React from 'react';
import { LogoIcon } from './icons/LogoIcon.tsx';

interface HeaderProps {
  onReset: () => void;
  hasImage: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, hasImage }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">
            Image Watermarker
          </h1>
        </div>
        {hasImage && (
           <button 
            onClick={onReset}
            className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors duration-200"
           >
             Upload New
           </button>
        )}
      </div>
    </header>
  );
};

export default Header;
