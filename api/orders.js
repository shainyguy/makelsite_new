import supabase from './_supabase.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { status } = req.query;
      let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
      
      if (status) query = query.eq('status', status);
      
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
      const { items, ...orderData } = req.body;
      
      // Create order
      const { data: order, error: orderError } = await supabase.from('orders').insert(orderData).select().single();
      if (orderError) throw orderError;
      
      // Create order items
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

🔗 <a href="${process.env.VERCEL_URL || ''}/admin">Открыть в CRM</a>
      `;
      await sendTelegramNotification(message);
      
      return res.status(201).json(order);
    }
    
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
