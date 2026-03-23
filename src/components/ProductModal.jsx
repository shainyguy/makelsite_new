import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Mail, ShoppingCart, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductModal({ product, isOpen, onClose, colors = [] }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  if (!isOpen || !product) return null;

  const variants = product.product_variants || [];
  const images = product.product_images || [];
  const mainImage = images[currentImageIndex]?.image_url || variants[0]?.image_url || '/images/placeholder.jpg';

  const handleRequestPrice = (e) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setShowRequestForm(false);
      setRequestSent(false);
    }, 2000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (images.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (images.length || 1)) % (images.length || 1));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{product.name}</h2>
              <p className="text-slate-500">{product.series?.name || 'MAKEL'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 p-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden">
                <img 
                  src={selectedVariant?.image_url || mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                
                {/* Image Navigation */}
                {(images.length > 1 || variants.length > 1) && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Thumbnail Indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentImageIndex === i ? 'bg-red-600 w-6' : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex === i ? 'border-red-600' : 'border-transparent'
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Описание</h3>
                <p className="text-slate-600 leading-relaxed">{product.description || 'Описание отсутствует'}</p>
              </div>

              {/* Color Variants */}
              {variants.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Доступные цвета</h3>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-slate-200 hover:border-red-300'
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded-full border border-slate-300"
                          style={{ backgroundColor: variant.color?.hex_code || '#ccc' }}
                        />
                        <span className="font-medium">{variant.color?.name}</span>
                        {variant.price && (
                          <span className="text-slate-500 ml-2">{variant.price} ₽</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              <div className="bg-slate-50 rounded-2xl p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Характеристики</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Артикул</span>
                    <span className="font-medium">{product.sku || 'MAK-' + product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Серия</span>
                    <span className="font-medium">{product.series?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Наличие</span>
                    <span className="font-medium text-green-600">В наличии</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Гарантия</span>
                    <span className="font-medium">5 лет</span>
                  </div>
                </div>
              </div>

              {/* B2B Actions */}
              <div className="space-y-3">
                {!showRequestForm ? (
                  <>
                    <button
                      onClick={() => setShowRequestForm(true)}
                      className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Запросить цену для дилеров
                    </button>
                    <button className="w-full py-4 border-2 border-slate-200 rounded-xl font-medium hover:border-red-300 hover:text-red-600 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      Скачать техническое описание
                    </button>
                  </>
                ) : requestSent ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-bold text-green-900">Запрос отправлен!</h4>
                    <p className="text-green-700 text-sm">Мы свяжемся с вами в ближайшее время</p>
                  </div>
                ) : (
                  <form onSubmit={handleRequestPrice} className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Запрос коммерческого предложения</h4>
                    <input
                      type="text"
                      placeholder="Название компании"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="tel"
                      placeholder="Телефон"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowRequestForm(false)}
                        className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-medium hover:bg-slate-50"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
                      >
                        Отправить
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Distributor Note */}
              <div className="bg-slate-50 rounded-xl p-4 text-sm">
                <p className="text-slate-600">
                  <strong className="text-slate-900">B2B предложение:</strong> Мы работаем с дилерами и строймаркетами. 
                  Отправьте запрос для получения оптовых цен и условий сотрудничества.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
