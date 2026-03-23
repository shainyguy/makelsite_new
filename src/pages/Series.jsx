import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Check, ChevronDown, ZoomIn, Download, ShoppingCart } from 'lucide-react';
import ProductModal from '../components/ProductModal.jsx';

export default function Series() {
  const { seriesSlug } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    fetchSeriesData();
    fetchColors();
  }, [seriesSlug]);

  const fetchSeriesData = async () => {
    setLoading(true);
    try {
      // Get series info
      const seriesRes = await fetch(`/api/series?slug=${seriesSlug}`);
      const seriesData = await seriesRes.json();
      if (seriesData.length > 0) {
        setSeries(seriesData[0]);
        
        // Get products for this series
        const productsRes = await fetch(`/api/products-full?series_id=${seriesData[0].id}`);
        const productsData = await productsRes.json();
        setProducts(productsData);
      }
    } catch (err) {
      console.error('Error fetching series:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchColors = async () => {
    try {
      const res = await fetch('/api/colors');
      const data = await res.json();
      setColors(data);
    } catch (err) {
      console.error('Error fetching colors:', err);
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Серия не найдена</h1>
        <Link to="/catalog" className="text-red-600 hover:underline">Вернуться в каталог</Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-red-600">Главная</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-red-600">Каталог</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{series.name}</span>
        </nav>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-2 text-slate-600 hover:text-red-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад в каталог
        </button>

        {/* Series Header */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Дизайнерская серия</span>
            <h1 className="text-5xl font-bold text-slate-900 mt-2 mb-4">{series.name}</h1>
            <p className="text-xl text-slate-600 mb-6 leading-relaxed">{series.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Сертифицированно</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Гарантия 5 лет</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>{products.length} товаров в серии</span>
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-slate-900 mb-3">Доступные цвета</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setSelectedColor(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedColor ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Все
                </button>
                {colors.map((color) => (
                  <button 
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                      selectedColor === color.id 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-transparent bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border border-slate-300"
                      style={{ backgroundColor: color.hex_code }}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <a 
                href="#products"
                className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                Смотреть товары
              </a>
              <button className="px-6 py-4 border-2 border-slate-200 rounded-xl font-medium hover:border-red-300 hover:text-red-600 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Каталог PDF
              </button>
            </div>
          </motion.div>

          {/* Series Images */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden">
              {series.cover_image ? (
                <img 
                  src={series.cover_image} 
                  alt={series.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8">
                    <div className="w-32 h-40 bg-white rounded-xl shadow-lg transform -rotate-6" />
                    <div className="w-32 h-40 bg-white rounded-xl shadow-lg transform rotate-3" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div id="products" className="scroll-mt-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Товары серии</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Product Image */}
                <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden group">
                  {product.product_images?.[0]?.image_url ? (
                    <img 
                      src={product.product_images[0].image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-32 bg-white rounded-lg shadow-md" />
                    </div>
                  )}
                  
                  {/* Zoom Button */}
                  <button 
                    onClick={() => openProductModal(product)}
                    className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ZoomIn className="w-5 h-5 text-slate-700" />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  {/* Available Colors */}
                  {product.product_variants?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 mb-2">Цвета:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.product_variants.slice(0, 6).map((variant, i) => (
                          <div 
                            key={i}
                            className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full text-xs"
                          >
                            <div 
                              className="w-3 h-3 rounded-full border border-slate-300"
                              style={{ backgroundColor: variant.color?.hex_code || '#ccc' }}
                            />
                            <span className="text-slate-700">{variant.color?.name}</span>
                          </div>
                        ))}
                        {product.product_variants.length > 6 && (
                          <span className="text-xs text-slate-500 px-2 py-1">
                            +{product.product_variants.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-sm text-slate-500">От</span>
                      <span className="text-xl font-bold text-red-600 ml-2">
                        {Math.min(...product.product_variants?.map(v => v.price) || [0])} ₽
                      </span>
                    </div>
                    <button 
                      onClick={() => openProductModal(product)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Подробнее
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Товары отсутствуют</h3>
              <p className="text-slate-600">В этой серии пока нет доступных товаров</p>
            </div>
          )}
        </div>

        {/* B2B Info Section */}
        <div className="mt-20 bg-slate-900 rounded-3xl p-10 text-white">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Интересует оптовая закупка?</h2>
              <p className="text-slate-300 mb-6">
                Мы работаем с дилерами и строймаркетами напрямую. 
                Предлагаем особые условия для постоянных партнёров.
              </p>
              <ul className="space-y-3 mb-8">
                {['Специальные цены для дилеров', 'Отсрочка платежа до 90 дней', 'Бесплатная доставка при заказе от 100 тыс. ₽', 'Маркетинговая поддержка'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/contacts"
                className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                Стать партнёром
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
            <div className="bg-white/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Запросить прайс-лист</h3>
              <p className="text-slate-300 mb-6">
                Оставьте контакты, и мы вышлем актуальный прайс-лист с оптовыми ценами 
                на всю продукцию MAKEL.
              </p>
              <form className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Ваш email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-red-400"
                />
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-yellow-300 transition-colors">
                  Получить прайс-лист
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        colors={colors}
      />
    </div>
  );
}
