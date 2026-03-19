import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, ExternalLink, Search, Building2, Store } from 'lucide-react';

const partnerCompanies = [
  { 
    name: 'Русский свет', 
    logo: 'РС',
    type: 'Федеральная сеть',
    locations: 320,
    cities: ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск'],
    description: 'Крупнейшая сеть магазинов электротоваров в России',
    website: 'https://russvet.ru'
  },
  { 
    name: 'Все инструменты.ру', 
    logo: 'ВИ',
    type: 'Онлайн + офлайн',
    locations: 250,
    cities: ['Москва', 'Екатеринбург', 'Челябинск', 'Тюмень'],
    description: 'Федеральная сеть магазинов инструментов и электротоваров',
    website: 'https://vseinstrumenti.ru'
  },
  { 
    name: 'Петрович', 
    logo: 'ПТ',
    type: 'Строймаркет',
    locations: 180,
    cities: ['Москва', 'Санкт-Петербург', 'Нижний Новгород', 'Ростов-на-Дону'],
    description: 'Крупнейшая сеть строймаркетов России',
    website: 'https://petrovich.ru'
  },
  { 
    name: 'ЭТМ (Электротехмонтаж)', 
    logo: 'ЭТМ',
    type: 'Электротехника',
    locations: 400,
    cities: ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань'],
    description: 'Крупнейший дистрибьютор электротехнической продукции в России',
    website: 'https://etm.ru'
  },
];

const dealers = [
  { city: 'Москва', address: 'ул. Примерная, 1', phone: '+7 (495) 123-45-67', name: 'ООО "Электро-Сервис"' },
  { city: 'Санкт-Петербург', address: 'пр. Энгельса, 20', phone: '+7 (812) 234-56-78', name: 'ЗАО "ЭлектроПром"' },
  { city: 'Казань', address: 'ул. Декабристов, 50', phone: '+7 (843) 345-67-89', name: 'ООО "Татэлектро"' },
  { city: 'Новосибирск', address: 'ул. Советская, 100', phone: '+7 (383) 456-78-90', name: 'ООО "Сибэлектро"' },
  { city: 'Екатеринбург', address: 'ул. Ленина, 25', phone: '+7 (343) 567-89-01', name: 'ООО "УралЭлектро"' },
];

export default function Partners() {
  const [searchCity, setSearchCity] = useState('');
  const [partnersList, setPartnersList] = useState([]);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/partners');
      const data = await res.json();
      if (data.length > 0) {
        setPartnersList(data);
      } else {
        setPartnersList([]);
      }
    } catch (err) {
      console.error('Error fetching partners:', err);
      setPartnersList([]);
    }
  };

  const filteredDealers = dealers.filter(d => 
    d.city.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Партнёры</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-3 mb-4">Где купить продукцию MAKEL</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Широкая сеть официальных партнёров и дилеров по всей России
          </p>
        </div>

        {/* Major Partners */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-red-600" />
            Официальные партнёры
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerCompanies.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {partner.logo}
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {partner.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{partner.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{partner.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <Store className="w-4 h-4" />
                  <span>{partner.locations} магазинов</span>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-slate-400 mb-2">Города присутствия:</p>
                  <div className="flex flex-wrap gap-2">
                    {partner.cities.slice(0, 3).map((city) => (
                      <span key={city} className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-full">
                        {city}
                      </span>
                    ))}
                    {partner.cities.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-full">
                        +{partner.cities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Перейти на сайт
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dealers Map */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <MapPin className="w-7 h-7 text-red-600" />
            Официальные дилеры
          </h2>
          
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по городу..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 shadow-sm"
              />
            </div>
          </div>
          
          {/* Dealers List */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredDealers.map((dealer, index) => (
              <motion.div
                key={dealer.address}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{dealer.city}</h3>
                    <p className="text-slate-600 text-sm mb-1">{dealer.name}</p>
                    <p className="text-slate-500 text-sm mb-3">{dealer.address}</p>
                    <a
                      href={`tel:${dealer.phone}`}
                      className="flex items-center gap-2 text-red-600 font-medium text-sm hover:text-red-700"
                    >
                      <Phone className="w-4 h-4" />
                      {dealer.phone}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Become Partner CTA */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Станьте нашим дилером</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Ищем надёжных партнёров для развития дилерской сети. 
            Предлагаем выгодные условия и полную поддержку.
          </p>
          <a
            href="/contacts"
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
          >
            Оставить заявку на дилерство
          </a>
        </div>
      </div>
    </div>
  );
}
