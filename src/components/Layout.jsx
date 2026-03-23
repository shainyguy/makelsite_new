import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Zap, Shield, Globe, Package, FileText, HelpCircle, Users } from 'lucide-react';
import { isAuthenticated, clearAuth } from '../lib/auth';
import CookieConsent from './CookieConsent.jsx';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setAuthenticated(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Главная' },
    { 
      path: '/catalog', 
      label: 'Каталог',
      submenu: [
        { path: '/catalog/recessed', label: 'Скрытая установка' },
        { path: '/catalog/external', label: 'Наружная серия' },
        { path: '/catalog/modular', label: 'Модульные системы' },
        { path: '/catalog/accessories', label: 'Аксессуары' },
        { path: '/catalog/panels', label: 'Электрощиты и автоматика' },
      ]
    },
    { path: '/3d', label: '3D Визуализатор' },
    { path: '/constructor', label: 'Конструктор' },
    { path: '/downloads', label: 'Каталоги PDF' },
    { path: '/partners', label: 'Где купить' },
    { path: '/support', label: 'Поддержка' },
    { path: '/contacts', label: 'Контакты' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+78001234567" className="flex items-center gap-2 hover:text-red-100 transition-colors">
              <Phone className="w-4 h-4" />
              <span>8 (800) 123-45-67</span>
            </a>
            <a href="mailto:info@makel.ru" className="flex items-center gap-2 hover:text-red-100 transition-colors hidden sm:flex">
              <Mail className="w-4 h-4" />
              <span>info@makel.ru</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Официальный дилер в России</span>
            </span>
            {authenticated && (
              <Link to="/admin" className="text-white hover:text-red-100 font-medium">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-red-500/30 transition-shadow">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">MAKEL</h1>
                <p className="text-xs text-slate-500 font-medium">Электроустановочные изделия</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.path} className="relative group">
                  {link.submenu ? (
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        location.pathname.startsWith(link.path)
                          ? 'text-red-600 bg-red-50'
                          : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                      }`}
                      onMouseEnter={() => setCatalogOpen(true)}
                      onMouseLeave={() => setCatalogOpen(false)}
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        location.pathname === link.path
                          ? 'text-red-600 bg-red-50'
                          : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                  
                  {link.submenu && catalogOpen && (
                    <div
                      className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2"
                      onMouseEnter={() => setCatalogOpen(true)}
                      onMouseLeave={() => setCatalogOpen(false)}
                    >
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors border-b border-slate-50 last:border-0"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/contacts"
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all transform hover:-translate-y-0.5"
              >
                Стать партнёром
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top-2">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <div key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg font-medium ${
                      location.pathname === link.path ? 'bg-red-50 text-red-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => !link.submenu && setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.submenu && (
                    <div className="ml-4 mt-1 space-y-1">
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="block px-4 py-2 text-sm text-slate-600 hover:text-red-600"
                          onClick={() => setMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/contacts"
                className="block w-full text-center bg-red-600 text-white px-6 py-3 rounded-xl font-semibold mt-4"
                onClick={() => setMenuOpen(false)}
              >
                Стать партнёром
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-400px)]">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="text-xl font-bold text-white">MAKEL</span>
              </div>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Турецкая компания с 1977 года. Лидер по экспорту электроматериалов из Турции.
              </p>
              <div className="flex gap-4">
                {['vk', 'tg', 'yt'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <span className="text-xs font-bold uppercase">{social}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-6">Продукция</h3>
              <ul className="space-y-3 text-sm">
                {['Скрытая установка', 'Наружная серия', 'Модульные системы', 'Электрощиты', 'Автоматика'].map((item) => (
                  <li key={item}>
                    <Link to="/catalog" className="hover:text-red-500 transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Partners */}
            <div>
              <h3 className="text-white font-semibold mb-6">Партнёры</h3>
              <ul className="space-y-3 text-sm">
                {['Русский свет', 'Все инструменты.ру', 'Петрович', 'ЭТМ (Электротехмонтаж)'].map((item) => (
                  <li key={item}>
                    <Link to="/partners" className="hover:text-red-500 transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-6">Контакты</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-red-500 shrink-0" />
                  <span>8 (800) 123-45-67<br/><span className="text-slate-500">Бесплатно по России</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-red-500 shrink-0" />
                  <span>info@makel.ru</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                  <span>Москва, ул. Примерная, 1</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2025 MAKEL. Все права защищены.</p>
            <div className="flex gap-6 text-sm text-slate-500 flex-wrap justify-center">
              <Link to="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Соглашение об обработке данных</Link>
              <a href="#" className="hover:text-white transition-colors">Оферта</a>
            </div>
          </div>
        </div>
      </footer>
      
      <CookieConsent />
    </div>
  );
}
