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
      const { status, source } = req.query;
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
      
      if (status) query = query.eq('status', status);
      if (source) query = query.eq('source', source);
      
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
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

🔗 <a href="${process.env.VERCEL_URL || ''}/admin">Открыть в CRM</a>
      `;
      await sendTelegramNotification(message);
      
      return res.status(201).json(data);
    }
    
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
