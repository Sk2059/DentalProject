
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('site-theme') as 'light' | 'dark') || 'dark'
  );
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem('site-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const language = i18n.language.startsWith('ne') ? 'ne' : 'en';
  const setLanguage = (lang: 'en' | 'ne') => {
    void i18n.changeLanguage(lang);
    localStorage.setItem('site-language', lang);
  };

  const navItems = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-primary text-primary-foreground py-1.5 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+977-1-4567890</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{t('topbar.location')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{t('topbar.hours')}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-md' : 'bg-background/95 backdrop-blur shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary">Sayapatri</h1>
                <p className="text-xs text-muted-foreground">{t('nav.hospital')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive(item.path)
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left animate-scale-in"></span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <div className="inline-flex rounded-full border border-border p-0.5 bg-background">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 text-xs rounded-full transition-all duration-300 ${language === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  {t('language.en')}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("ne")}
                  className={`px-3 py-1 text-xs rounded-full transition-all duration-300 ${language === "ne" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  {t('language.ne')}
                </button>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Link to="/appointment">
                <Button className="hover:scale-105 transition-transform duration-300">
                  {t('nav.bookAppointment')}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 animate-fade-in">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive(item.path)
                        ? 'text-primary bg-accent rounded-md'
                        : 'text-foreground hover:text-primary hover:bg-accent rounded-md'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex items-center gap-2 px-3">
                  <Button variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} size="icon">
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" onClick={() => setLanguage(language === "en" ? "ne" : "en")}>
                    {language === "en" ? t('language.ne') : t('language.en')}
                  </Button>
                </div>
                <Link to="/appointment" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full mt-2">{t('nav.bookAppointment')}</Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
