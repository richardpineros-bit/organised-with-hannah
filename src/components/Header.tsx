import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const SECTION_IDS = ['about', 'services', 'pricing', 'customers', 'contact'];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeSection = useScrollSpy(SECTION_IDS, 100);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/', sectionId: '' },
    { label: 'About', href: '/#about', sectionId: 'about' },
    { label: 'Services', href: '/#services', sectionId: 'services' },
    { label: 'Pricing', href: '/#pricing', sectionId: 'pricing' },
    { label: 'Shop', href: '/store', sectionId: null },
    { label: 'Reviews', href: '/#customers', sectionId: 'customers' },
    { label: 'Contact', href: '/#contact', sectionId: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    if (href === '/') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    navigate(href);
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/85 backdrop-blur-lg shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          <a href="/" className="flex flex-col items-start" onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}>
            <span className={`text-lg font-bold tracking-[4px] transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-white'}`}>ORGANISED</span>
            <span className={`text-[10px] tracking-[2px] uppercase transition-colors duration-300 ${scrolled ? 'text-text-secondary' : 'text-white/80'}`}>WITH HANNAH</span>
          </a>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isScrollSection = item.sectionId !== null;
              const isActive = isHomePage && isScrollSection && activeSection === item.sectionId;
              const isHomeActive = isHomePage && item.sectionId === '' && !activeSection;
              const isPageActive = !isHomePage && item.href === location.pathname;
              const showActive = isActive || isHomeActive || isPageActive;
              return (
                <button key={item.label} onClick={() => handleNavClick(item.href)}
                  className={`group relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    showActive ? 'text-primary' : scrolled ? 'text-text-primary hover:text-primary hover:bg-primary/10' : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}>
                  {item.label}
                  <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
                    showActive ? 'w-5 bg-primary opacity-100' : 'w-0 bg-primary/60 opacity-0 group-hover:w-3 group-hover:opacity-100'
                  }`} />
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <button onClick={() => navigate('/booking')}
              className={`px-5 py-2.5 text-sm font-semibold tracking-wider uppercase transition-colors duration-200 ${
                scrolled ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white text-primary hover:bg-white/90'
              }`}>
              Book now
            </button>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className={scrolled ? 'text-primary' : 'text-white'}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white">
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <button key={item.label} onClick={() => { handleNavClick(item.href); setMobileMenuOpen(false); }}
                    className="text-lg font-medium text-text-primary hover:text-primary transition-colors duration-200 text-left">
                    {item.label}
                  </button>
                ))}
                <button onClick={() => { setMobileMenuOpen(false); navigate('/booking'); }}
                  className="bg-primary text-white px-5 py-3 text-sm font-semibold tracking-wider uppercase text-center hover:bg-primary-dark transition-colors duration-200">
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
