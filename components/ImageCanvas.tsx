
import React, { useRef, useEffect, forwardRef } from 'react';
import { WatermarkSettings, FilterType } from '../types.ts';

interface ImageCanvasProps {
  image: File;
  settings: WatermarkSettings[];
  filter: FilterType;
}

const getFontFamilyName = (fontClass: string): string => {
  switch (fontClass) {
    case 'font-inter':
      return 'Inter';
    case 'font-montserrat':
      return 'Montserrat';
    case 'font-lobster':
      return 'Lobster';
    case 'font-roboto-mono':
      return 'Roboto Mono';
    case 'font-playfair-display':
      return 'Playfair Display';
    default:
      return 'Inter';
  }
};

const getFilterString = (filterType: FilterType): string => {
  switch (filterType) {
    case 'grayscale':
      return 'grayscale(100%)';
    case 'sepia':
      return 'sepia(100%)';
    case 'invert':
      return 'invert(100%)';
    case 'none':
    default:
      return 'none';
  }
};

const ImageCanvas = forwardRef<HTMLCanvasElement, ImageCanvasProps>(({ image, settings, filter }, ref) => {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || internalRef;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = () => {
      // Scale canvas to fit container while maintaining aspect ratio
      const container = canvas.parentElement;
      if (!container) return;
      
      const maxWidth = container.clientWidth;
      const maxHeight = container.clientHeight;
      const imgAspectRatio = img.width / img.height;
      
      let canvasWidth = maxWidth;
      let canvasHeight = canvasWidth / imgAspectRatio;

      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = canvasHeight * imgAspectRatio;
      }
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw the image with filter
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = getFilterString(filter);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none'; // Reset filter so it doesn't affect watermarks

      // Loop through each setting and draw the watermark
      settings.forEach(setting => {
        // Prepare for watermark
        ctx.globalAlpha = setting.opacity;
        
        const finalFontFamily = getFontFamilyName(setting.fontFamily);
        
        ctx.font = `bold ${setting.fontSize}px ${finalFontFamily}`;
        ctx.fillStyle = setting.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const numColumns = setting.density * 2;
        const stepX = canvas.width / numColumns;
        const stepY = stepX * 1.5;

        for (let y = -stepY; y < canvas.height + stepY; y += stepY) {
          for (let x = -stepX; x < canvas.width + stepX; x += stepX) {
              ctx.save();
              const offsetX = (y / stepY) % 2 === 0 ? 0 : stepX / 2;
              ctx.translate(x + offsetX, y);
              ctx.rotate((setting.rotation * Math.PI) / 180);

              if (setting.shadowEnabled) {
                ctx.shadowColor = setting.shadowColor;
                ctx.shadowBlur = setting.shadowBlur;
                ctx.shadowOffsetX = setting.shadowOffsetX;
                ctx.shadowOffsetY = setting.shadowOffsetY;
              }
              
              ctx.fillText(setting.text, 0, 0);
              ctx.restore();
          }
        }
      });

      URL.revokeObjectURL(img.src); // Clean up memory
    };
  }, [image, settings, filter]);

  return <canvas ref={canvasRef} className="max-w-full max-h-full object-contain rounded-md" />;
});

export default ImageCanvas;
