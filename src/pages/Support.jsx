import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, FileText, Wrench, Shield, Phone, 
  Mail, ChevronDown, ChevronUp, CheckCircle, AlertCircle,
  Download, Book
} from 'lucide-react';

const faqs = [
  {
    question: 'Как отличить оригинальную продукцию MAKEL от подделки?',
    answer: 'Оригинальная продукция MAKEL имеет голограмму и уникальный штрих-код на упаковке. Также все изделия имеют маркировку бренда на обратной стороне. Покупайте только у официальных дилеров.'
  },
  {
    question: 'Какой степени защиты (IP) выбрать для ванной комнаты?',
    answer: 'Для ванных комнат рекомендуется использовать изделия со степенью защиты IP44 или IP54. Для общих жилых помещений достаточно IP20.'
  },
  {
    question: 'Можно ли комбинировать рамки разных серий?',
    answer: 'В пределах одной серии да, комбинировать можно. Например, в серии Lillium можно сочетать белые и кремовые рамки и клавиши.'
  },
  {
    question: 'Какой гарантийный срок на продукцию?',
    answer: 'На всю электроустановочную продукцию MAKEL действует гарантия 5 лет. На электрощиты и автоматику — 3 года.'
  },
  {
    question: 'Есть ли у вас обучение для монтажников?',
    answer: 'Да, мы проводим бесплатное обучение для партнёров и дилеров. Обучаем правильной установке, современным трендам и технологиям продаж.'
  },
];

const resources = [
  { icon: FileText, title: 'Инструкции по монтажу', desc: 'Подробные руководства' },
  { icon: Book, title: 'Технические каталоги', desc: 'Характеристики и схемы' },
  { icon: Shield, title: 'Сертификаты', desc: 'Документы качества' },
  { icon: Wrench, title: 'Чертежи и размеры', desc: 'CAD и PDF файлы' },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Помощь</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-3 mb-4">Поддержка клиентов</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ответы на частые вопросы, техническая документация и инструкции
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white"
          >
            <Phone className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Телефон поддержки</h3>
            <p className="text-white/80 mb-4">Бесплатно по России</p>
            <a href="tel:88001234567" className="text-2xl font-bold hover:text-yellow-300 transition-colors">
              8 (800) 123-45-67
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <Mail className="w-10 h-10 text-red-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
            <p className="text-slate-500 mb-4">Техническая поддержка</p>
            <a href="mailto:support@makel.ru" className="text-lg font-semibold text-red-600 hover:text-red-700">
              support@makel.ru
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <HelpCircle className="w-10 h-10 text-red-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Гарантия</h3>
            <p className="text-slate-500 mb-4">На всю продукцию</p>
            <span className="text-2xl font-bold text-slate-900">5 лет</span>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <HelpCircle className="w-7 h-7 text-red-600" />
              Часто задаваемые вопросы
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-red-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5">
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <FileText className="w-7 h-7 text-red-600" />
              Полезные материалы
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {resources.map((resource, index) => (
                <motion.a
                  key={resource.title}
                  href="/downloads"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-red-300 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                    <resource.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{resource.title}</h3>
                    <p className="text-sm text-slate-500">{resource.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Warranty Info */}
            <div className="mt-8 bg-slate-900 rounded-2xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Гарантийное обслуживание</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    При обнаружении брака обратитесь в ближайший авторизованный сервисный центр 
                    или свяжитесь с нами по телефону горячей линии.
                  </p>
                  <a href="/downloads" className="inline-flex items-center gap-2 text-yellow-400 font-semibold hover:text-yellow-300">
                    <Download className="w-4 h-4" />
                    Скачать гарантийный талон
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
