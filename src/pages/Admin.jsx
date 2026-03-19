import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, ShoppingCart, Package, Settings, 
  LogOut, TrendingUp, DollarSign, UserPlus, Bell,
  Search, Filter, MoreVertical, ChevronDown, CheckCircle, 
  Clock, AlertCircle, XCircle, Plus, Trash2, Edit,
  Phone, Mail, MapPin
} from 'lucide-react';
import { isAuthenticated, clearAuth, getUser } from '../lib/auth';

const tabs = [
  { id: 'dashboard', name: 'Дашборд', icon: LayoutDashboard },
  { id: 'leads', name: 'Лиды', icon: Users },
  { id: 'orders', name: 'Заказы', icon: ShoppingCart },
  { id: 'products', name: 'Товары', icon: Package },
  { id: 'partners', name: 'Партнёры', icon: UserPlus },
  { id: 'settings', name: 'Настройки', icon: Settings },
];

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  contacted: 'bg-purple-100 text-purple-700',
};

const statusLabels = {
  new: 'Новый',
  processing: 'В работе',
  completed: 'Завершён',
  cancelled: 'Отменён',
  contacted: 'Связались',
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leads, setLeads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newLeadsToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch leads
      const leadsRes = await fetch('/api/leads');
      if (!leadsRes.ok) throw new Error(`Leads API error: ${leadsRes.status}`);
      const leadsData = await leadsRes.json();
      setLeads(leadsData || []);

      // Fetch orders
      const ordersRes = await fetch('/api/orders');
      if (!ordersRes.ok) throw new Error(`Orders API error: ${ordersRes.status}`);
      const ordersData = await ordersRes.json();
      setOrders(ordersData || []);

      // Fetch products
      const productsRes = await fetch('/api/products');
      if (!productsRes.ok) throw new Error(`Products API error: ${productsRes.status}`);
      const productsData = await productsRes.json();
      setProducts(productsData || []);

      // Fetch partners
      const partnersRes = await fetch('/api/partners');
      const partnersData = await partnersRes.json();
      setPartners(partnersData);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      setStats({
        totalLeads: leadsData.length,
        totalOrders: ordersData.length,
        totalRevenue: ordersData.reduce((sum, o) => sum + (o.total_amount || 0), 0),
        newLeadsToday: leadsData.filter(l => l.created_at?.startsWith(today)).length
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const updateLeadStatus = async (id, status) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating lead:', err);
    }
  };

  const deleteLead = async (id) => {
    if (!confirm('Удалить лид?')) return;
    try {
      const res = await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Всего лидов', value: stats.totalLeads, icon: Users, color: 'blue', change: `+${stats.newLeadsToday} сегодня` },
          { title: 'Заказов', value: stats.totalOrders, icon: ShoppingCart, color: 'green', change: 'В этом месяце' },
          { title: 'Выручка', value: `₽${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'yellow', change: '+12% к прошлому' },
          { title: 'Партнёров', value: partners?.length || 0, icon: UserPlus, color: 'purple', change: 'Активных' },
        ].map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Последние лиды</h3>
          <div className="space-y-3">
            {(leads || []).slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">{lead.name}</p>
                  <p className="text-sm text-slate-500">{lead.company || 'Без компании'}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${statusColors[lead.status] || statusColors.new}`}>
                  {statusLabels[lead.status] || 'Новый'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Последние заказы</h3>
          <div className="space-y-3">
            {(orders || []).slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">Заказ #{order.id}</p>
                  <p className="text-sm text-slate-500">{order.client_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">₽{order.total_amount?.toLocaleString()}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${statusColors[order.status] || statusColors.new}`}>
                    {statusLabels[order.status] || 'Новый'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Лиды ({leads.length})</h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Filter className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Клиент</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Контакты</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Источник</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Статус</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Дата</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(leads || []).map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{lead.name}</div>
                  <div className="text-sm text-slate-500">{lead.company || '—'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-900">{lead.phone}</div>
                  <div className="text-sm text-slate-500">{lead.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{lead.source || 'Сайт'}</span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    className={`text-xs px-3 py-1 rounded-full border-0 ${statusColors[lead.status] || statusColors.new}`}
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Заказы ({orders.length})</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">#</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Клиент</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Сумма</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Статус</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(orders || []).map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{order.client_name}</div>
                  <div className="text-sm text-slate-500">{order.company || '—'}</div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">₽{order.total_amount?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${statusColors[order.status] || statusColors.new}`}>
                    {statusLabels[order.status] || 'Новый'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(order.created_at).toLocaleDateString('ru-RU')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'leads': return renderLeads();
      case 'orders': return renderOrders();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-bold">
            M
          </div>
          {sidebarOpen && <span className="font-bold text-xl">MAKEL</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{tab.name}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Выйти</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            {tabs.find(t => t.id === activeTab)?.name || 'Админ-панель'}
          </h1>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">A</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-medium text-slate-900">Администратор</p>
                <p className="text-sm text-slate-500">admin@makel.ru</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-red-500 text-xl mb-4">⚠️ Ошибка загрузки данных</div>
              <p className="text-slate-500 mb-4">{error}</p>
              <button 
                onClick={() => fetchData()} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Повторить
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
}
