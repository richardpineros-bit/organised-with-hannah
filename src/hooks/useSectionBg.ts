import { useContentStore } from '@/store/contentStore';

const BG_MAP: Record<string, string> = {
  primary: 'bg-primary',
  white: 'bg-white',
  gray: 'bg-gray-50',
  warm: 'bg-[hsl(35,25%,97%)]',
  dark: 'bg-gray-900',
  none: 'bg-transparent',
};

export function useSectionBg(section: string, defaultColor: string = 'white') {
  const { getValue } = useContentStore();
  const color = getValue(section, 'bg_color', defaultColor);
  return BG_MAP[color] || BG_MAP[defaultColor] || 'bg-white';
}
