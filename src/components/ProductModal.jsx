import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Image, Upload } from 'lucide-react';

export default function ProductModal({ product, isOpen, onClose, onImageUpload }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(product?.imageUrl || null);

  if (!isOpen || !product) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    // Симуляция загрузки изображения
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
      setUploading(false);
      if (onImageUpload) {
        onImageUpload(product.id, event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">{product.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Image Upload Area */}
            <div className="mb-6">
              <div className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 hover:border-red-400 transition-colors">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <Image className="w-16 h-16 mb-4" />
                    <p className="text-sm">Нет изображения</p>
                  </div>
                )}
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all cursor-pointer group">
                  <div className="opacity-0 group-hover:opacity-100 bg-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <Upload className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-slate-700">Загрузить фото</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {uploading && (
                <p className="text-sm text-slate-500 mt-2 text-center">Загрузка...</p>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Описание</h3>
                <p className="text-slate-600">{product.description || 'Описание отсутствует'}</p>
              </div>

              {product.colors && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Доступные цвета</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.price && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Цена</h3>
                  <p className="text-2xl font-bold text-red-600">{product.price} ₽</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => alert('Функция заказа в разработке')}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Заказать
              </button>
              <button
                onClick={() => alert('Каталог скачивается...')}
                className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                <Download className="w-5 h-5" />
                PDF
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
