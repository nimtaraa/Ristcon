import { useState } from "react";
import { Menu, X } from "lucide-react"; 
import { Link } from "react-router-dom";
import { useConference } from "@/hooks/useConference";
import { useYear } from "@/contexts/YearContext";
import ScrollTop from "./ScrollTop";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: conference } = useConference(undefined, 'assets');
  const { selectedYear } = useYear();

  // Build base path with year if available
  const basePath = selectedYear ? `/ristcon/${selectedYear}` : '';

  const navItems = [
    { name: 'ABOUT', path: `${basePath}/about` },
    { name: 'AUTHOR INSTRUCTIONS', path: `${basePath}/author-instructions` },
    { name: 'REGISTRATION', path: `${basePath}/registration` },
    { name: 'PAST EVENTS', path: `${basePath}/past-events` },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <ScrollTop to={selectedYear ? `/ristcon/${selectedYear}` : '/'}>
            <div className="flex items-center space-x-3">
              {conference?.assets && conference.assets.length > 0 ? (
                <img 
                  src={conference.assets.find(a => a.asset_type === 'logo')?.asset_url || conference.assets[0].asset_url} 
                  alt={conference.assets.find(a => a.asset_type === 'logo')?.alt_text || "RISTCON Logo"} 
                  className="w-14 h-14 object-contain" 
                />
              ) : (
                <div className="relative w-14 h-14 rounded-lg bg-gradient-to-br from-primary-foreground to-primary-foreground/80 flex items-center justify-center shadow-lg"></div>
              )}
              <span className="text-primary-foreground font-black text-2xl tracking-tight italic">
                Ristcon
              </span>
            </div>
          </ScrollTop>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <ScrollTop
                key={item.name}
                to={item.path}
              >
               <span className="text-white/90 hover:text-white hover:text-primary transition-colors duration-200 font-medium relative group cursor-pointer">                  
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full"></span>
                </span>
              </ScrollTop>
            ))}
          
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg animate-fade-in">
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;