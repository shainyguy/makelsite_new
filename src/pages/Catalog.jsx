import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, ChevronDown, Package, Download } from 'lucide-react';
import ProductModal from '../components/ProductModal.jsx';

const categories = [
  { id: 'recessed', name: 'Скрытая установка', icon: Package },
  { id: 'external', name: 'Наружная серия', icon: Package },
  { id: 'modular', name: 'Модульные системы', icon: Package },
  { id: 'accessories', name: 'Аксессуары', icon: Package },
  { id: 'panels', name: 'Электрощиты и автоматика', icon: Package },
];

const seriesData = {
  recessed: [
    { name: 'Lillium', desc: 'Классический дизайн, округлые формы', colors: ['Белый', 'Крем'] },
    { name: 'Lillium Natural', desc: 'Натуральные текстуры', colors: ['Дуб', 'Орех', 'Черешня'] },
    { name: 'Lillium Kare', desc: 'Квадратный дизайн', colors: ['Белый', 'Крем', 'Дымчатый'] },
    { name: 'Mimoza', desc: 'Плавные линии, элегантность', colors: ['Белый', 'Крем', 'Зелёный металлик', 'Серый металлик'] },
    { name: 'Defne', desc: 'Современный дизайн, яркие цвета', colors: ['Широкая палитра'] },
    { name: 'Manolya', desc: 'Изогнутые линии, премиум', colors: ['Белый', 'Крем', 'Серебро', 'Золото', 'Дерево'] },
    { name: 'Karea', desc: 'Геометричный минимализм', colors: ['Различные комбинации'] },
  ],
  external: [
    { name: 'IP20', desc: 'Стандартные для сухих помещений', colors: ['Белый', 'Крем'] },
    { name: 'IP44 / IP54', desc: 'Влагозащита для ванных и кухонь', colors: ['Белый', 'Серый'] },
    { name: 'IP55 Plus', desc: 'Усиленная защита от пыли и воды', colors: ['Белый', 'Серый'] },
  ],
  modular: [
    { name: 'Millanta модульная', desc: 'До 6 модулей в рамке', colors: ['Белый', 'Крем', 'Серый'] },
    { name: 'Kare модульная', desc: 'Квадратный дизайн', colors: ['Белый', 'Чёрный'] },
  ],
  accessories: [
    { name: 'Удлинители', desc: 'Grup Priz серия', colors: ['Белый', 'Чёрный'] },
    { name: 'Штепсельные колодки', desc: 'Многорозеточные', colors: ['Разные варианты'] },
    { name: 'Вилки и тройники', desc: 'Электрические аксессуары', colors: ['Стандарт'] },
    { name: 'Адаптеры', desc: 'Переходники', colors: ['Стандарт'] },
  ],
  panels: [
    { name: 'Электрощиты внутренние', desc: 'Настенные и встраиваемые', colors: ['Белый', 'Металл'] },
    { name: 'Электрощиты наружные', desc: 'Уличное использование', colors: ['Металл', 'Пластик'] },
    { name: 'Автоматы', desc: 'Автоматические выключатели', colors: ['Разные характеристики'] },
    { name: 'Счётчики', desc: 'Электронные', colors: ['Стандарт'] },
  ],
};

export default function Catalog() {
  const { categoryId } = useParams();
  const [activeCategory, setActiveCategory] = useState(categoryId || 'recessed');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    if (categoryId) {
      setActiveCategory(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?category=${activeCategory}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const currentSeries = seriesData[activeCategory] || [];

  const openProductModal = (product) => {
    const productWithImage = {
      ...product,
      imageUrl: productImages[product.name] || product.imageUrl
    };
    setSelectedProduct(productWithImage);
    setIsModalOpen(true);
  };

  const handleImageUpload = (productId, imageUrl) => {
    setProductImages(prev => ({
      ...prev,
      [productId]: imageUrl
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

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
            Широкий ассортимент электроустановочных изделий MAKEL. Все серии, цвета и конфигурации.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog/${cat.id}`}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по каталогу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
                <Filter className="w-5 h-5" />
                <span>Фильтры</span>
              </button>
              
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Series Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSeries.map((serie, index) => (
            <motion.div
              key={serie.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-red-200 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-3">
                    {serie.colors.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-20 h-32 bg-white rounded-lg shadow-md border border-slate-200 group-hover:scale-105 transition-transform"
                        style={{ transform: `rotate(${(i - 1) * 5}deg)` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                  {serie.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4">{serie.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {serie.colors.map((color) => (
                    <span key={color} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                      {color}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openProductModal({
                      id: serie.name,
                      name: serie.name,
                      description: serie.desc,
                      colors: serie.colors,
                      price: null
                    })}
                    className="text-red-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Подробнее
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                  <button className="p-2 bg-slate-50 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Нужен полный каталог с ценами?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Скачайте актуальный прайс-лист или свяжитесь с нами для получения коммерческого предложения
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/downloads"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
            >
              <Download className="w-5 h-5" />
              Скачать каталог PDF
            </Link>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-colors"
            >
              Запросить прайс-лист
            </Link>
          </div>
        </div>
      </div>
      
      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}
