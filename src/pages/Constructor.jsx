import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Grid3X3, RotateCcw, Download, Share2, Check, Layers } from 'lucide-react';

const frameSizes = [1, 2, 3, 4, 5, 6];

const colors = [
  { id: 'white', name: 'Белый', bg: 'bg-white', border: 'border-slate-200' },
  { id: 'cream', name: 'Крем', bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'smoke', name: 'Дымчатый', bg: 'bg-slate-300', border: 'border-slate-400' },
  { id: 'black', name: 'Чёрный', bg: 'bg-slate-800', border: 'border-slate-900' },
  { id: 'silver', name: 'Серебро', bg: 'bg-gradient-to-br from-slate-300 to-slate-400', border: 'border-slate-500' },
  { id: 'gold', name: 'Золото', bg: 'bg-gradient-to-br from-yellow-300 to-yellow-500', border: 'border-yellow-600' },
  { id: 'blue', name: 'Синий', bg: 'bg-blue-500', border: 'border-blue-600' },
  { id: 'green', name: 'Зелёный', bg: 'bg-emerald-500', border: 'border-emerald-600' },
  { id: 'red', name: 'Красный', bg: 'bg-red-500', border: 'border-red-600' },
  { id: 'wood-oak', name: 'Дуб', bg: 'bg-gradient-to-br from-amber-200 to-amber-400', border: 'border-amber-600' },
  { id: 'wood-walnut', name: 'Орех', bg: 'bg-gradient-to-br from-amber-700 to-amber-900', border: 'border-amber-950' },
];

const modules = [
  { id: 'switch', name: 'Выключатель', icon: '⏼', width: 1 },
  { id: 'socket', name: 'Розетка', icon: '🔌', width: 1 },
  { id: 'socket-gnd', name: 'Розетка с заземлением', icon: '⚡', width: 1 },
  { id: 'double-socket', name: 'Розетка 2-я', icon: '🔌🔌', width: 1 },
  { id: 'dimmer', name: 'Диммер', icon: '💡', width: 1 },
  { id: 'tv', name: 'TV розетка', icon: '📺', width: 1 },
  { id: 'ethernet', name: 'RJ45', icon: '📡', width: 1 },
  { id: 'usb', name: 'USB', icon: '🔋', width: 1 },
  { id: 'blank', name: 'Заглушка', icon: '⬜', width: 1 },
];

export default function Constructor() {
  const [frameSize, setFrameSize] = useState(2);
  const [frameColor, setFrameColor] = useState(colors[0]);
  const [frameOrientation, setFrameOrientation] = useState('horizontal');
  const [selectedModules, setSelectedModules] = useState(
    Array(7).fill(null).map((_, i) => i < 2 ? modules[0] : null)
  );
  
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleModuleSelect = (index, module) => {
    const newModules = [...selectedModules];
    newModules[index] = module;
    setSelectedModules(newModules);
  };

  const handleReset = () => {
    setSelectedModules(Array(7).fill(null));
    setFrameColor(colors[0]);
    
    setFrameSize(2);
  };

  const activeModules = selectedModules.slice(0, frameSize);
  const filledModules = activeModules.filter(m => m !== null).length;

  return (
    <div className="py-12 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Конфигуратор</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-3 mb-4">Соберите свою рамку</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Визуальный конструктор для подбора комбинаций рамок и модулей MAKEL
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Frame Size */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-red-600" />
                Размер рамки
              </h3>
              <div className="flex flex-wrap gap-2">
                {frameSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setFrameSize(size)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all ${
                      frameSize === size
                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-3">Количество модулей в рамке</p>
            </div>

            {/* Frame Color */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-red-600" />
                Цвет рамки
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setFrameColor(color)}
                    className={`aspect-square rounded-xl ${color.bg} border-2 transition-all ${
                      frameColor.id === color.id
                        ? `border-red-500 ring-2 ring-red-500/30`
                        : 'border-transparent hover:scale-105'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-700 mt-3 font-medium">Выбрано: {frameColor.name}</p>
            </div>

            

            {/* Orientation */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Ориентация</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setFrameOrientation('horizontal')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    frameOrientation === 'horizontal'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Горизонтально
                </button>
                <button
                  onClick={() => setFrameOrientation('vertical')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    frameOrientation === 'vertical'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Вертикально
                </button>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Frame Preview */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 min-h-[400px] flex items-center justify-center">
              <motion.div
                layout
                className={`${frameColor.bg} ${frameColor.border} border-4 rounded-3xl p-3 shadow-2xl ${
                  frameOrientation === 'vertical' ? 'flex flex-col' : 'flex flex-row'
                }`}
              >
                {activeModules.map((module, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-white border-slate-200 border-2 rounded-xl m-1 flex items-center justify-center transition-all ${
                      frameOrientation === 'vertical' ? 'w-24 h-24' : 'w-24 h-32'
                    }`}
                  >
                    {module ? (
                      <div className="text-center">
                        <div className="text-2xl mb-1">{module.icon}</div>
                        <div className="text-xs font-medium text-slate-700 px-1">{module.name}</div>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm">Пусто</div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Module Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Выберите модули для каждой позиции</h3>
              
              <div className={`grid ${frameOrientation === 'vertical' ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-4'} gap-4 mb-6`}>
                {Array.from({ length: frameSize }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Позиция {index + 1}</label>
                    <select
                      value={selectedModules[index]?.id || ''}
                      onChange={(e) => {
                        const module = modules.find(m => m.id === e.target.value);
                        handleModuleSelect(index, module || null);
                      }}
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Не выбрано</option>
                      {modules.map((module) => (
                        <option key={module.id} value={module.id}>{module.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Quick Select Grid */}
              <div className="border-t border-slate-100 pt-6">
                <p className="text-sm text-slate-500 mb-4">Быстрый выбор модуля:</p>
                <div className="flex flex-wrap gap-2">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => {
                        // Сначала ищем пустое место в активных модулях
                        const emptyIndex = selectedModules.findIndex((m, i) => i < frameSize && m === null);
                        if (emptyIndex !== -1) {
                          handleModuleSelect(emptyIndex, module);
                        } else {
                          // Если нет пустых мест, заменяем последний модуль
                          handleModuleSelect(frameSize - 1, module);
                        }
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      {module.icon} {module.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
              >
                <Download className="w-5 h-5" />
                Сохранить конфигурацию
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold hover:bg-slate-300 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Сбросить
              </button>
              <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                <Share2 className="w-5 h-5" />
                Поделиться
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">100+ вариаций</h3>
            <p className="text-slate-600 text-sm">Разнообразие цветов и комбинаций для любого интерьера</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">7 модулей</h3>
            <p className="text-slate-600 text-sm">Максимум 7 модулей в одной рамке для гибкости дизайна</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Сертифицировано</h3>
            <p className="text-slate-600 text-sm">Вся продукция сертифицирована и соответствует стандартам</p>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Сохранить конфигурацию</h3>
            <p className="text-slate-600 mb-6">
              Оставьте контактные данные, и мы пришлём подробную информацию о выбранной конфигурации и ценах.
            </p>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
              />
              <input
                type="tel"
                placeholder="Телефон"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSaveModal(false);
                    alert('Конфигурация сохранена!');
                  }}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Отправить
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
