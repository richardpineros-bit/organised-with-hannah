import { useContentStore } from '@/store/contentStore';
import { useMemo } from 'react';

const BG_MAP: Record<string, string> = {
  primary: 'bg-primary',
  white: 'bg-white',
  gray: 'bg-gray-50',
  warm: 'bg-[hsl(35,25%,97%)]',
  dark: 'bg-gray-900',
  none: 'bg-transparent',
};

export interface SectionBg {
  className: string;
  style: React.CSSProperties;
  hasImage: boolean;
  overlayOpacity: number;
  textLight: boolean;
}

export function useSectionBg(section: string, defaultColor: string = 'white'): SectionBg {
  const { getValue } = useContentStore();

  const bgColor = getValue(section, 'bg_color', defaultColor);
  const bgImage = getValue(section, 'bg_image', '');        // e.g. "/images/about-bg.jpg"
  const overlayRaw = getValue(section, 'bg_overlay', '0');     // 0-100 (percentage)
  const overlayOpacity = Math.min(100, Math.max(0, parseInt(overlayRaw, 10) || 0));

  return useMemo(() => {
    const hasImage = !!bgImage && bgImage.trim() !== '';

    // If image is set, we use bg-transparent + inline backgroundImage
    // If no image, use the solid color class
    const className = hasImage ? 'bg-transparent relative overflow-hidden' : (BG_MAP[bgColor] || BG_MAP[defaultColor] || 'bg-white');

    const style: React.CSSProperties = hasImage
      ? {
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      : {};

    // Text is light (white) when: green bg, dark bg, or image with >=30% overlay
    const textLight =
      (!hasImage && (bgColor === 'primary' || bgColor === 'dark')) ||
      (hasImage && overlayOpacity >= 30);

    return {
      className,
      style,
      hasImage,
      overlayOpacity,
      textLight,
    };
  }, [bgColor, bgImage, overlayOpacity, defaultColor]);
}
