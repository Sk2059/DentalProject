
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+977-1-4567890</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Itahari, Nepal</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Mon-Sat: 9AM-6PM</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-background border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary">Sayapatri</h1>
                <p className="text-xs text-muted-foreground">Dental Hospital</p>
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

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link to="/appointment">
                <Button className="hover:scale-105 transition-transform duration-300">
                  Book Appointment
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
                <Link to="/appointment" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full mt-2">Book Appointment</Button>
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
