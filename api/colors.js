import { supabase, handleQuery } from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    switch (req.method) {
      case 'GET':
        return handleQuery(
          supabase.from('colors').select('*').order('name', { ascending: true }),
          res
        );

      case 'POST':
        const { data, error } = await supabase
          .from('colors')
          .insert(req.body)
          .select()
          .single();
        if (error) throw error;
        return res.status(201).json(data);

      case 'PUT':
        const { id, ...updates } = req.body;
        const { data: updated, error: updateError } = await supabase
          .from('colors')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (updateError) throw updateError;
        return res.status(200).json(updated);

      case 'DELETE':
        await supabase.from('colors').delete().eq('id', req.body.id);
        return res.status(200).json({ ok: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Colors API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
