import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

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
                <p className="text-sm opacity-80">{t('nav.hospital')}</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {[
                { name: t('nav.home'), path: '/' },
                { name: t('nav.services'), path: '/services' },
                { name: t('footer.aboutUs'), path: '/about' },
                { name: t('nav.contact'), path: '/contact' },
                { name: t('footer.appointment'), path: '/appointment' },
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
            <h4 className="text-lg font-semibold">{t('footer.contactInfo')}</h4>
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
                <span className="text-sm">{t('footer.address')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{t('topbar.hours')}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('footer.followUs')}</h4>
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
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-300">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-300">
                {t('footer.terms')}
              </a>
              <Link 
                to="/admin-login" 
                className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-300 hover:underline"
              >
                {t('footer.admin')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
