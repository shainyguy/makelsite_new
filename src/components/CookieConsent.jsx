import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShow(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookie_consent', 'necessary');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Cookie className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-slate-900">Мы используем cookies</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              В соответствии с ФЗ-152 "О персональных данных" мы используем cookies для улучшения работы сайта, 
              аналитики и персонализации. Вы можете принять все cookies или только необходимые.
              <a href="/privacy" className="text-red-600 hover:underline ml-1">Подробнее</a>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={acceptNecessary}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Только необходимые
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Принять всё
            </button>
            <button
              onClick={acceptNecessary}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
