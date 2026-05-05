import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingBag } from 'lucide-react';
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

  // Scroll nav items only - pages with section anchors
  const scrollNavItems = [
    { label: 'Home', href: '/', sectionId: '' },
    { label: 'About', href: '/#about', sectionId: 'about' },
    { label: 'Services', href: '/#services', sectionId: 'services' },
    { label: 'Pricing', href: '/#pricing', sectionId: 'pricing' },
    { label: 'Reviews', href: '/#customers', sectionId: 'customers' },
    { label: 'Contact', href: '/#contact', sectionId: 'contact' },
  ];

  // CTA buttons - separate page links
  const ctaButtons = [
    { label: 'Shop', href: '/store', icon: ShoppingBag },
    { label: 'Book Now', href: '/booking' },
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
  // Home is only active when at the very top (scrollY < 100) and no other section is active
  const isAtTop = typeof window !== 'undefined' && window.scrollY < 100;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/90 backdrop-blur-lg shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <a href="/" className="flex flex-col items-start" onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}>
            <span className={`text-lg font-bold tracking-[4px] transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-white'}`}>ORGANISED</span>
            <span className={`text-[10px] tracking-[2px] uppercase transition-colors duration-300 ${scrolled ? 'text-text-secondary' : 'text-white/80'}`}>WITH HANNAH</span>
          </a>

          {/* Center: Scroll nav items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {scrollNavItems.map((item) => {
              const isActive = isHomePage && activeSection === item.sectionId;
              // Home tab only active when literally at top AND no section active
              const isHomeActive = isHomePage && item.sectionId === '' && !activeSection && isAtTop;
              const showActive = isActive || isHomeActive;

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

          {/* Right: CTA buttons (Shop + Book Now) */}
          <div className="hidden lg:flex items-center space-x-3">
            {ctaButtons.map((item) => {
              if (item.href === '/store') {
                return (
                  <button key={item.label} onClick={() => navigate(item.href)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold tracking-wider uppercase rounded-md transition-all duration-200 border ${
                      scrolled 
                        ? 'border-primary text-primary hover:bg-primary hover:text-white' 
                        : 'border-white/50 text-white hover:bg-white/20 hover:border-white'
                    }`}>
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </button>
                );
              }
              return (
                <button key={item.label} onClick={() => navigate(item.href)}
                  className={`px-5 py-2.5 text-sm font-semibold tracking-wider uppercase rounded-md transition-colors duration-200 ${
                    scrolled ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white text-primary hover:bg-white/90'
                  }`}>
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className={scrolled ? 'text-primary' : 'text-white'}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white">
              <div className="flex flex-col space-y-6 mt-8">
                {scrollNavItems.map((item) => (
                  <button key={item.label} onClick={() => { handleNavClick(item.href); setMobileMenuOpen(false); }}
                    className="text-lg font-medium text-text-primary hover:text-primary transition-colors duration-200 text-left">
                    {item.label}
                  </button>
                ))}
                <hr className="border-gray-200" />
                <button onClick={() => { setMobileMenuOpen(false); navigate('/store'); }}
                  className="flex items-center gap-2 text-lg font-medium text-text-primary hover:text-primary transition-colors duration-200 text-left">
                  <ShoppingBag className="w-5 h-5" /> Shop
                </button>
                <button onClick={() => { setMobileMenuOpen(false); navigate('/booking'); }}
                  className="bg-primary text-white px-5 py-3 text-sm font-semibold tracking-wider uppercase text-center hover:bg-primary-dark transition-colors duration-200 rounded-md">
                  Book Now
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
