export type FilterType = 'none' | 'grayscale' | 'sepia' | 'invert';

export interface WatermarkSettings {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  opacity: number;
  density: number;
  rotation: number;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}
