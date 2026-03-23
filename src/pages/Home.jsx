import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Zap, Shield, Globe, Package, ArrowRight, Award, 
  Users, Factory, CheckCircle, Sparkles, TrendingUp,
  Wrench, Lightbulb, Power, Settings
} from 'lucide-react';

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const stats = [
    { value: '1977', label: 'Год основания', icon: Factory },
    { value: '40+', label: 'Стран экспорта', icon: Globe },
    { value: '1300+', label: 'Наименований', icon: Package },
    { value: '45000', label: 'м² производство', icon: Factory },
  ];

  const advantages = [
    { icon: Shield, title: 'Официальный дилер', desc: 'Гарантия подлинности продукции' },
    { icon: Factory, title: 'Прямые поставки', desc: 'С завода по конкурентным ценам' },
    { icon: Award, title: 'Сертификация', desc: 'VDE, ТУрецкий институт стандартов' },
    { icon: Package, title: 'Широкий ассортимент', desc: 'Решения для любого интерьера' },
  ];

  const productLines = [
    { 
      name: 'Lillium', 
      desc: 'Классический дизайн', 
      colors: ['bg-white', 'bg-orange-100'],
      series: 'lillium'
    },
    { 
      name: 'Lillium Kare', 
      desc: 'Квадратный дизайн', 
      colors: ['bg-white', 'bg-slate-200', 'bg-slate-400'],
      series: 'lillium-kare'
    },
    { 
      name: 'Mimoza', 
      desc: 'Плавные линии', 
      colors: ['bg-white', 'bg-emerald-200', 'bg-slate-300'],
      series: 'mimoza'
    },
    { 
      name: 'Defne', 
      desc: 'Современный стиль', 
      colors: ['bg-white', 'bg-blue-400', 'bg-pink-400'],
      series: 'defne'
    },
  ];

  const partners = ['Русский свет', 'Все инструменты', 'Петрович', 'ЭТМ (Электротехмонтаж)'];

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          {/* Background Image - замените на свою картинку в /public/images/hero-bg.jpg */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero-bg.jpg'), url('/images/hero-bg.svg')" }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-transparent" />
          
          {/* Animated Shapes */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full border border-white/5"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full border border-white/3"
          />
        </motion.div>

        {/* Content */}
        <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-8 border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Официальный дилер в России с 2015 года</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Электроустановочные
              <span className="block text-yellow-300">изделия MAKEL</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-white/90 mb-10 leading-relaxed"
            >
              Ищем дистрибьюторов и партнёров. Прямые поставки с завода в Турции. 
              Сертифицированная продукция для вашего бизнеса.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Link
                to="/contacts"
                className="group inline-flex items-center gap-3 bg-white text-red-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-300 hover:text-red-700 transition-all shadow-2xl hover:shadow-white/25"
              >
                Стать партнёром
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                <Package className="w-5 h-5" />
                Каталог продукции
              </Link>
            </motion.div>
            
            {/* Hero Image Placeholder */}
            {/* Stats Preview - Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="hidden lg:block"
            >
              <div className="space-y-4">
                {stats.slice(0, 2).map((stat, i) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </div>
                  </div>
                ))}
                
                {/* CTA Card */}
                <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-6 text-white">
                  <p className="text-white/80 text-sm mb-2">Станьте дилером</p>
                  <Link to="/contacts" className="text-white font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    Подробнее <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
            </div>
          </div>

          {/* Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Advantages Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Почему MAKEL</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-4">Ключевые преимущества для бизнеса</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Работаем напрямую с заводом, обеспечивая лучшие условия для наших партнёров
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((adv, i) => (
              <AnimatedSection key={adv.title}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100 hover:border-red-200 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/30">
                    <adv.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{adv.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{adv.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Product Lines */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Коллекции</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-4">Дизайнерские серии розеток и выключателей</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Широкая линейка позволяет подобрать решение для любого интерьера и стиля
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productLines.map((line, i) => (
              <AnimatedSection key={line.name}>
                <Link to={`/catalog/${line.series}`}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex gap-2">
                          {line.colors.map((color, j) => (
                            <motion.div
                              key={j}
                              initial={{ y: 20, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              transition={{ delay: j * 0.1 }}
                              className={`w-16 h-24 ${color} rounded-lg shadow-md border border-slate-200 group-hover:scale-105 transition-transform`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">{line.name}</h3>
                      <p className="text-slate-600 text-sm">{line.desc}</p>
                      <div className="mt-4 flex items-center text-red-600 font-semibold text-sm">
                        Подробнее
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-12 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-slate-800 transition-colors"
            >
              Смотреть все коллекции
              <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* B2B CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">Для бизнеса</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
                Станьте нашим дистрибьютором
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Ищем надёжных партнёров по всей России. Предлагаем выгодные условия сотрудничества: 
                отсрочки платежа, маркетинговая поддержка, обучение персонала.
              </p>

              <div className="space-y-4 mb-10">
                {['Отсрочка платежа до 90 дней', 'Минимальный заказ от 100 000 ₽', 'Доставка по всей России', 'Маркетинговые материалы и обучение'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-6 h-6 text-red-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/contacts"
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-xl hover:shadow-red-600/30"
              >
                Оставить заявку
                <ArrowRight className="w-5 h-5" />
              </Link>
            </AnimatedSection>

            <AnimatedSection>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: TrendingUp, value: '+35%', label: 'Рост продаж в 2024' },
                  { icon: Users, value: '500+', label: 'Партнёров' },
                  { icon: Package, value: '98%', label: 'Наличие на складе' },
                  { icon: Award, value: '5 дней', label: 'Средняя доставка' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center"
                  >
                    <stat.icon className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <span className="text-slate-500 font-medium">Уже работаем с лидерами</span>
          </AnimatedSection>
          
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {partners.map((partner) => (
              <div key={partner} className="text-2xl font-bold text-slate-400 hover:text-slate-600 transition-colors">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
