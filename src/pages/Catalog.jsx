import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, ChevronDown, Package, ArrowRight, Image } from 'lucide-react';

const categories = [
  { id: 1, name: 'Скрытая установка', slug: 'recessed' },
  { id: 2, name: 'Наружная серия', slug: 'external' },
  { id: 3, name: 'Модульные системы', slug: 'modular' },
  { id: 4, name: 'Аксессуары', slug: 'accessories' },
  { id: 5, name: 'Электрощиты', slug: 'panels' },
];

export default function Catalog() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(1);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (categoryId) {
      const cat = categories.find(c => c.slug === categoryId);
      if (cat) setActiveCategory(cat.id);
    }
    fetchSeries();
  }, [categoryId, activeCategory]);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/series?category_id=${activeCategory}&active=true`);
      const data = await res.json();
      setSeries(data);
    } catch (err) {
      console.error('Error fetching series:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSeries = series.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-red-600">Главная</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Каталог</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Каталог продукции</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Ознакомьтесь с дизайнерскими сериями MAKEL. Каждая серия представлена 
            в различных цветах и конфигурациях для любого интерьера.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                navigate(`/catalog/${cat.slug}`);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Package className="w-5 h-5" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск серий..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-0 focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl text-slate-700 hover:bg-slate-100">
              <Filter className="w-5 h-5" />
              <span>Фильтры</span>
            </button>
          </div>
        </div>

        {/* Series Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSeries.map((serie, index) => (
              <motion.div
                key={serie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-red-200 transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="h-56 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                  {serie.cover_image ? (
                    <img 
                      src={serie.cover_image} 
                      alt={serie.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-32 bg-white rounded-lg shadow-lg border border-slate-300 transform -rotate-6" />
                      <div className="w-24 h-32 bg-white rounded-lg shadow-lg border border-slate-300 transform rotate-6 -ml-8" />
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Link 
                        to={`/catalog/series/${serie.slug}`}
                        className="w-full py-3 bg-white text-red-600 rounded-xl font-bold text-center block hover:bg-yellow-300 transition-colors"
                      >
                        Смотреть коллекцию
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                    {serie.name}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">{serie.description}</p>
                  
                  {/* Available Colors Preview */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-slate-500">Цвета:</span>
                    <div className="flex -space-x-2">
                      {['#FFFFFF', '#F5F5DC', '#C0C0C0', '#FFD700'].map((color, i) => (
                        <div 
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-600">
                        +4
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/catalog/series/${serie.slug}`}
                    className="flex items-center justify-between pt-4 border-t border-slate-100"
                  >
                    <span className="text-red-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Подробнее
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="text-sm text-slate-400">В наличии</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSeries.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Серии не найдены</h3>
            <p className="text-slate-600">Попробуйте изменить параметры поиска</p>
          </div>
        )}

        {/* B2B CTA */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Нужен доступ к оптовым ценам?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Зарегистрируйтесь как дилер для получения прайс-листа и индивидуальных условий сотрудничества.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
            >
              Стать дилером
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
