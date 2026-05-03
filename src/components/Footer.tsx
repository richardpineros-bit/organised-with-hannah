import { Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-white/80 text-sm tracking-wider mb-4">Declutter | Clean | Transform</p>
        <div className="mb-8">
          <span className="text-2xl font-bold tracking-[4px] text-white block">ORGANISED</span>
          <span className="text-xs tracking-[2px] text-white/80 uppercase">WITH HANNAH</span>
        </div>
        <div className="flex justify-center space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors duration-200"><Facebook className="w-5 h-5" /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors duration-200"><Instagram className="w-5 h-5" /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors duration-200"><Youtube className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  );
}
