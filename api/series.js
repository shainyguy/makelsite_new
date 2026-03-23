import { supabase, handleQuery } from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    switch (req.method) {
      case 'GET':
        const { category_id, active } = req.query;
        let query = supabase.from('series').select('*, series_images(*), products(*)').order('sort_order', { ascending: true });
        
        if (category_id) query = query.eq('category_id', category_id);
        if (active !== undefined) query = query.eq('active', active === 'true');
        
        return handleQuery(query, res);

      case 'POST':
        const { images, ...seriesData } = req.body;
        
        // Create series
        const { data: series, error: seriesError } = await supabase
          .from('series')
          .insert(seriesData)
          .select()
          .single();
        
        if (seriesError) throw seriesError;
        
        // Add images if provided
        if (images && images.length > 0) {
          const seriesImages = images.map(img => ({ ...img, series_id: series.id }));
          await supabase.from('series_images').insert(seriesImages);
        }
        
        return res.status(201).json(series);

      case 'PUT':
        const { id, images: updateImages, ...updates } = req.body;
        
        const { data: updatedSeries, error: updateError } = await supabase
          .from('series')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        return res.status(200).json(updatedSeries);

      case 'DELETE':
        const { id: deleteId } = req.body;
        await supabase.from('series').delete().eq('id', deleteId);
        return res.status(200).json({ ok: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Series API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
