import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Image, Book, Video, ExternalLink, Check } from 'lucide-react';

const catalogs = [
  { 
    id: 1, 
    title: 'Общий каталог продукции 2025', 
    size: '45 MB', 
    pages: 256,
    type: 'pdf',
    category: 'Каталоги',
    description: 'Полный каталог всей продукции MAKEL с ценами и техническими характеристиками'
  },
  { 
    id: 2, 
    title: 'Серия Lillium — презентация', 
    size: '12 MB', 
    pages: 32,
    type: 'pdf',
    category: 'Каталоги',
    description: 'Детальная информация о классической серии розеток и выключателей'
  },
  { 
    id: 3, 
    title: 'Серия Mimoza — презентация', 
    size: '15 MB', 
    pages: 28,
    type: 'pdf',
    category: 'Каталоги',
    description: 'Элегантная серия с плавными линиями и различными цветами'
  },
  { 
    id: 4, 
    title: 'Технический каталог', 
    size: '28 MB', 
    pages: 124,
    type: 'pdf',
    category: 'Техническая документация',
    description: 'Технические характеристики, чертежи и спецификации'
  },
  { 
    id: 5, 
    title: 'Инструкция по монтажу', 
    size: '8 MB', 
    pages: 48,
    type: 'pdf',
    category: 'Техническая документация',
    description: 'Подробное руководство по установке и подключению изделий'
  },
  { 
    id: 6, 
    title: 'Сертификаты и соответствия', 
    size: '5 MB', 
    pages: 20,
    type: 'pdf',
    category: 'Сертификаты',
    description: 'VDE, ТР ТС, ГОСТ — все сертификаты качества'
  },
];

const images = [
  { id: 1, title: 'Фотографии продукции HD', count: 150, type: 'zip' },
  { id: 2, title: '3D модели для дизайнеров', count: 45, type: 'zip' },
  { id: 3, title: 'Логотипы и брендбук', count: 25, type: 'zip' },
];

export default function Downloads() {
  const [activeTab, setActiveTab] = useState('all');
  const [downloaded, setDownloaded] = useState([]);

  const handleDownload = (id) => {
    setDownloaded([...downloaded, id]);
    setTimeout(() => {
      alert('Файл успешно скачан!');
    }, 500);
  };

  const filteredCatalogs = activeTab === 'all' 
    ? catalogs 
    : catalogs.filter(c => c.category === activeTab);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Ресурсы</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-3 mb-4">Скачать каталоги и материалы</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Вся необходимая информация для выбора и установки продукции MAKEL
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['Все', 'Каталоги', 'Техническая документация', 'Сертификаты'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab === 'Все' ? 'all' : tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                (tab === 'Все' && activeTab === 'all') || activeTab === tab
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PDF Catalogs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <FileText className="w-7 h-7 text-red-600" />
            PDF Каталоги
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCatalogs.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-7 h-7 text-red-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{item.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span>{item.pages} стр.</span>
                  <span>•</span>
                  <span>{item.size}</span>
                  <span>•</span>
                  <span className="uppercase">{item.type}</span>
                </div>
                
                <button
                  onClick={() => handleDownload(item.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                    downloaded.includes(item.id)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {downloaded.includes(item.id) ? (
                    <>
                      <Check className="w-5 h-5" />
                      Скачано
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Скачать PDF
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Images & Media */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Image className="w-7 h-7 text-red-600" />
            Изображения и медиа
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {images.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                  <Image className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{item.count} файлов в архиве</p>
                <button
                  onClick={() => handleDownload(item.id + 100)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Скачать .{item.type}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Request Form */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <Book className="w-12 h-12 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Нужен печатный каталог?</h2>
            <p className="text-slate-300 mb-8">
              Оставьте заявку, и мы вышлем вам печатные каталоги с полным ассортиментом и ценами.
              Также доступны образцы продукции для витрин.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors"
              >
                Заказать каталог
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
