import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Reviews', href: '/#customers' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-header' : 'bg-white/95'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          <a href="/" className="flex flex-col items-start">
            <span className="text-lg font-bold tracking-[4px] text-primary">ORGANISED</span>
            <span className="text-[10px] tracking-[2px] text-text-secondary uppercase">WITH HANNAH</span>
          </a>

          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200 relative group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <button onClick={() => navigate('/booking')} className="bg-primary text-white px-5 py-2.5 text-sm font-semibold tracking-wider uppercase hover:bg-primary-dark transition-colors duration-200">
              Book now
            </button>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white">
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <a key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-primary hover:text-primary transition-colors duration-200">
                    {item.label}
                  </a>
                ))}
                <button onClick={() => { setMobileMenuOpen(false); navigate('/booking'); }} className="bg-primary text-white px-5 py-3 text-sm font-semibold tracking-wider uppercase text-center hover:bg-primary-dark transition-colors duration-200">
                  Book now
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
