import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, ShoppingCart, Package, Settings, 
  LogOut, TrendingUp, DollarSign, UserPlus, Bell,
  Search, Filter, MoreVertical, ChevronDown, CheckCircle, 
  Clock, AlertCircle, XCircle, Plus, Trash2, Edit,
  Phone, Mail, MapPin, X, Image, Upload
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
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'recessed',
    series: '',
    description: '',
    price: '',
    in_stock: true,
    image_url: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
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

  // Product Modal Functions
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || '',
        category: product.category || 'recessed',
        series: product.series || '',
        description: product.description || '',
        price: product.price || '',
        in_stock: product.in_stock !== false,
        image_url: product.image_url || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        category: 'recessed',
        series: '',
        description: '',
        price: '',
        in_stock: true,
        image_url: ''
      });
    }
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setUploadingImage(false);
  };

  const saveProduct = async () => {
    try {
      const url = editingProduct ? '/api/products' : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct 
        ? { ...productForm, id: editingProduct.id }
        : productForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        closeProductModal();
        fetchData();
      } else {
        const err = await res.json();
        alert('Ошибка сохранения: ' + err.error);
      }
    } catch (err) {
      alert('Ошибка сохранения');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Удалить товар?')) return;
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setProductForm({ ...productForm, image_url: event.target.result });
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
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

  const renderProducts = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Товары ({products?.length || 0})</h3>
        <button 
          onClick={() => openProductModal()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Название</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Категория</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Серия</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Цена</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Статус</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(products || []).map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{product.name}</div>
                  <div className="text-sm text-slate-500">{product.description?.substring(0, 50)}...</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.series || '-'}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{product.price ? `${product.price} ₽` : '-'}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.in_stock ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => openProductModal(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

  const renderPartners = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Партнёры ({partners?.length || 0})</h3>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Название</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Тип</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Точек</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Статус</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(partners || []).map((partner) => (
              <tr key={partner.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{partner.name}</div>
                  <div className="text-sm text-slate-500">{partner.description?.substring(0, 50)}...</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{partner.type}</td>
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">{partner.locations}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${partner.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {partner.active ? 'Активен' : 'Не активен'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Настройки уведомлений Telegram</h3>
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bot Token</label>
            <input type="text" placeholder="123456789:ABCdef..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Chat ID</label>
            <input type="text" placeholder="123456789" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
          <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">
            Сохранить настройки
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Общие настройки</h3>
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Название сайта</label>
            <input type="text" defaultValue="MAKEL" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Контактный email</label>
            <input type="email" defaultValue="info@makel.ru" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'leads': return renderLeads();
      case 'orders': return renderOrders();
      case 'products': return renderProducts();
      case 'partners': return renderPartners();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  // Product Modal Component
  const ProductModal = () => {
    if (!isProductModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {editingProduct ? 'Редактировать товар' : 'Новый товар'}
            </h2>
            <button onClick={closeProductModal} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Фото товара</label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300">
                  {productForm.image_url ? (
                    <img src={productForm.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Image className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? 'Загрузка...' : 'Загрузить фото'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-500 mt-2">Поддерживаются JPG, PNG, WebP</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Название *</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                placeholder="Например: Выключатель 1-кл Lillium"
              />
            </div>

            {/* Category & Series */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Категория</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  <option value="recessed">Скрытая установка</option>
                  <option value="external">Наружная серия</option>
                  <option value="modular">Модульные системы</option>
                  <option value="accessories">Аксессуары</option>
                  <option value="panels">Электрощиты</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Серия</label>
                <input
                  type="text"
                  value={productForm.series}
                  onChange={(e) => setProductForm({...productForm, series: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  placeholder="Lillium"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Цена (₽)</label>
              <input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                placeholder="150"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Описание</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="Описание товара..."
              />
            </div>

            {/* In Stock */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="in_stock"
                checked={productForm.in_stock}
                onChange={(e) => setProductForm({...productForm, in_stock: e.target.checked})}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <label htmlFor="in_stock" className="text-slate-700">В наличии</label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={closeProductModal}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={saveProduct}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                {editingProduct ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
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
      
      {/* Product Modal */}
      <ProductModal />
    </div>
  );
}
