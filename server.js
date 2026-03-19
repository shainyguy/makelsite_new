const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(cors());
app.use(express.json());

// Serve static files from dist
app.use(express.static('dist'));

// Telegram notification helper
async function sendTelegramNotification(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error('Telegram notification failed:', err);
  }
}

// Auth routes
app.post('/api/auth', async (req, res) => {
  try {
    const { action, email, password } = req.body;
    
    if (action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return res.json({ user: data.user, session: data.session });
    }
    
    if (action === 'verify') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return res.status(401).json({ error: 'Invalid token' });
      
      return res.json({ user });
    }
    
    res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: err.message });
  }
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabase.from('products').select('*').order('id', { ascending: true });
    
    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leads API
app.get('/api/leads', async (req, res) => {
  try {
    const { status, source } = req.query;
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
    
    if (status) query = query.eq('status', status);
    if (source) query = query.eq('source', source);
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const lead = req.body;
    const { data, error } = await supabase.from('leads').insert(lead).select().single();
    if (error) throw error;
    
    // Send Telegram notification
    const message = `
🎯 <b>Новый лид с сайта Makel!</b>

📋 Источник: ${lead.source || 'Сайт'}
👤 Имя: ${lead.name}
🏢 Компания: ${lead.company || 'Не указана'}
📧 Email: ${lead.email}
📱 Телефон: ${lead.phone}
💬 Сообщение: ${lead.message || 'Нет сообщения'}
    `;
    await sendTelegramNotification(message);
    
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/leads', async (req, res) => {
  try {
    const { id, ...updates } = req.body;
    const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/leads', async (req, res) => {
  try {
    const { id } = req.body;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders API
app.get('/api/orders', async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    
    if (status) query = query.eq('status', status);
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, ...orderData } = req.body;
    
    const { data: order, error: orderError } = await supabase.from('orders').insert(orderData).select().single();
    if (orderError) throw orderError;
    
    if (items && items.length > 0) {
      const orderItems = items.map(item => ({ ...item, order_id: order.id }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;
    }
    
    // Send Telegram notification
    const itemsList = items?.map(i => `• ${i.product_name} x${i.quantity}`).join('\n') || '';
    const message = `
📦 <b>Новый заказ с сайта Makel!</b>

🆔 Заказ #${order.id}
👤 Клиент: ${order.client_name}
🏢 Компания: ${order.company || 'Не указана'}
📧 Email: ${order.email}
📱 Телефон: ${order.phone}
💰 Сумма: ${order.total_amount?.toLocaleString('ru-RU')} ₽

📋 Товары:
${itemsList}
    `;
    await sendTelegramNotification(message);
    
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Partners API
app.get('/api/partners', async (req, res) => {
  try {
    const { type } = req.query;
    let query = supabase.from('partners').select('*').order('id', { ascending: true });
    
    if (type) query = query.eq('type', type);
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all for React Router
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
