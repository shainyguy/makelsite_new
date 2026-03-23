import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, ShoppingCart, Package, Settings, 
  LogOut, Plus, Trash2, Edit, X, Save, Search, Building2,
  MapPin, Phone, Mail, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { isAuthenticated, clearAuth } from '../lib/auth';

const tabs = [
  { id: 'dashboard', name: 'Дашборд', icon: LayoutDashboard },
  { id: 'leads', name: 'Лиды', icon: Users },
  { id: 'orders', name: 'Заказы', icon: ShoppingCart },
  { id: 'series', name: 'Серии', icon: Package },
  { id: 'partners', name: 'Партнёры', icon: Building2 },
  { id: 'settings', name: 'Настройки', icon: Settings },
];

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  contacted: 'bg-purple-100 text-purple-700',
};

// Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({ leads: [], orders: [], series: [], partners: [] });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, type: '', item: null });
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [leadsRes, ordersRes, partnersRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/orders'),
        fetch('/api/partners'),
      ]);

      const leads = leadsRes.ok ? await leadsRes.json() : [];
      const orders = ordersRes.ok ? await ordersRes.json() : [];
      const partners = partnersRes.ok ? await partnersRes.json() : [];

      // Get series from products
      const productsRes = await fetch('/api/products');
      const products = productsRes.ok ? await productsRes.json() : [];
      
      // Extract unique series
      const seriesMap = new Map();
      products.forEach(p => {
        if (p.series && !seriesMap.has(p.series)) {
          seriesMap.set(p.series, {
            id: p.series,
            name: p.series,
            category: p.category,
            description: p.description || '',
            productCount: 0
          });
        }
        if (p.series) {
          seriesMap.get(p.series).productCount++;
        }
      });

      setData({
        leads,
        orders,
        partners,
        series: Array.from(seriesMap.values())
      });
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const openModal = (type, item = null) => {
    setModal({ isOpen: true, type, item });
    setFormData(item || {});
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: '', item: null });
    setFormData({});
  };

  const saveItem = async (endpoint, method = 'POST') => {
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        closeModal();
        fetchAllData();
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const deleteItem = async (endpoint, id) => {
    if (!confirm('Удалить?')) return;
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const updateStatus = async (endpoint, id, status) => {
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  // Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-blue-600">{data.leads.length}</div>
          <div className="text-slate-500">Всего лидов</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-green-600">{data.orders.length}</div>
          <div className="text-slate-500">Заказов</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-purple-600">{data.series.length}</div>
          <div className="text-slate-500">Серий</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-orange-600">{data.partners.length}</div>
          <div className="text-slate-500">Партнёров</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Последние лиды</h3>
          <div className="space-y-3">
            {data.leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="p-3 bg-slate-50 rounded-xl">
                <div className="font-medium">{lead.name}</div>
                <div className="text-sm text-slate-500">{lead.email}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Последние заказы</h3>
          <div className="space-y-3">
            {data.orders.slice(0, 5).map(order => (
              <div key={order.id} className="p-3 bg-slate-50 rounded-xl">
                <div className="font-medium">Заказ #{order.id}</div>
                <div className="text-sm text-slate-500">{order.client_name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Leads
  const renderLeads = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <h3 className="text-lg font-bold">Лиды ({data.leads.length})</h3>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Имя</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Контакты</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Статус</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.leads.map(lead => (
            <tr key={lead.id} className="border-b hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="font-medium">{lead.name}</div>
                <div className="text-sm text-slate-500">{lead.company}</div>
              </td>
              <td className="px-6 py-4 text-sm">
                <div>{lead.phone}</div>
                <div className="text-slate-500">{lead.email}</div>
              </td>
              <td className="px-6 py-4">
                <select 
                  value={lead.status} 
                  onChange={(e) => updateStatus('leads', lead.id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm border-0 ${statusColors[lead.status] || statusColors.new}`}
                >
                  {Object.keys(statusColors).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4">
                <button onClick={() => deleteItem('leads', lead.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Series
  const renderSeries = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <h3 className="text-lg font-bold">Серии продуктов ({data.series.length})</h3>
        <button 
          onClick={() => openModal('series')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700"
        >
          <Plus className="w-4 h-4" /> Добавить серию
        </button>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Название</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Категория</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Товаров</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.series.map(series => (
            <tr key={series.id} className="border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-medium">{series.name}</td>
              <td className="px-6 py-4 text-slate-600">{series.category}</td>
              <td className="px-6 py-4">{series.productCount}</td>
              <td className="px-6 py-4">
                <button onClick={() => openModal('series', series)} className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2">
                  <Edit className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Partners
  const renderPartners = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <h3 className="text-lg font-bold">Партнёры ({data.partners.length})</h3>
        <button 
          onClick={() => openModal('partner')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700"
        >
          <Plus className="w-4 h-4" /> Добавить партнёра
        </button>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Название</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Тип</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Точки</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.partners.map(partner => (
            <tr key={partner.id} className="border-b hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="font-medium">{partner.name}</div>
                <div className="text-sm text-slate-500">{partner.description?.slice(0, 50)}...</div>
              </td>
              <td className="px-6 py-4">{partner.type}</td>
              <td className="px-6 py-4">{partner.locations}</td>
              <td className="px-6 py-4">
                <button onClick={() => openModal('partner', partner)} className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => deleteItem('partners', partner.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Settings
  const renderSettings = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold mb-6">Настройки</h3>
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Telegram Bot Token</label>
          <input type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="123456:ABC..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Telegram Chat ID</label>
          <input type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="123456789" />
        </div>
        <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">
          Сохранить
        </button>
      </div>
    </div>
  );

  // Orders
  const renderOrders = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-bold">Заказы ({data.orders.length})</h3>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">#</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Клиент</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Сумма</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Статус</th>
          </tr>
        </thead>
        <tbody>
          {data.orders.map(order => (
            <tr key={order.id} className="border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-medium">#{order.id}</td>
              <td className="px-6 py-4">
                <div>{order.client_name}</div>
                <div className="text-sm text-slate-500">{order.email}</div>
              </td>
              <td className="px-6 py-4 font-bold">{order.total_amount} ₽</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status] || statusColors.new}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'leads': return renderLeads();
      case 'orders': return renderOrders();
      case 'series': return renderSeries();
      case 'partners': return renderPartners();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-bold">M</div>
          <span className="font-bold text-xl">MAKEL</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-xl">
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{tabs.find(t => t.id === activeTab)?.name}</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">A</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>

      {/* Modal for Add/Edit */}
      <Modal 
        isOpen={modal.isOpen} 
        onClose={closeModal}
        title={modal.item ? 'Редактировать' : 'Добавить'}
      >
        <div className="space-y-4">
          {modal.type === 'partner' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Название</label>
                <input 
                  className="w-full px-4 py-3 border rounded-xl"
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Тип</label>
                <select 
                  className="w-full px-4 py-3 border rounded-xl"
                  value={formData.type || ''}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="">Выберите</option>
                  <option value="Федеральная сеть">Федеральная сеть</option>
                  <option value="Строймаркет">Строймаркет</option>
                  <option value="Дилер">Дилер</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Количество точек</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 border rounded-xl"
                  value={formData.locations || ''}
                  onChange={e => setFormData({...formData, locations: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea 
                  className="w-full px-4 py-3 border rounded-xl"
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <button 
                onClick={() => saveItem('partners', modal.item ? 'PUT' : 'POST')}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
              >
                Сохранить
              </button>
            </>
          )}
          
          {modal.type === 'series' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Название серии</label>
                <input 
                  className="w-full px-4 py-3 border rounded-xl"
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Категория</label>
                <select 
                  className="w-full px-4 py-3 border rounded-xl"
                  value={formData.category || ''}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Выберите</option>
                  <option value="recessed">Скрытая установка</option>
                  <option value="external">Наружная серия</option>
                  <option value="modular">Модульные</option>
                  <option value="accessories">Аксессуары</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <textarea 
                  className="w-full px-4 py-3 border rounded-xl"
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <button 
                onClick={() => saveItem('products', 'POST')}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
              >
                Сохранить
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
