import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hospital Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">S</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Sayapatri</h3>
                <p className="text-sm opacity-80">Dental Hospital</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Providing exceptional dental care with advanced technology and compassionate service. 
              Your smile is our priority.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Appointment', path: '/appointment' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-300 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+977-1-4567890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span className="text-sm">info@sayapatridental.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1" />
                <span className="text-sm">New Road, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Mon-Sat: 9AM-6PM</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-80">
              © 2024 Sayapatri Dental Hospital. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-300">
                Terms of Service
              </a>
              <Link 
                to="/admin-login" 
                className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-300 hover:underline"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
