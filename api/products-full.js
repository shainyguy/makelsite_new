import { supabase, handleQuery } from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    switch (req.method) {
      case 'GET':
        const { series_id, category_id, search } = req.query;
        
        // Get products with their variants and images
        let query = supabase
          .from('products')
          .select(`
            *,
            product_variants(*, color:colors(*)),
            product_images(*)
          `)
          .order('sort_order', { ascending: true });
        
        if (series_id) query = query.eq('series_id', series_id);
        if (category_id) query = query.eq('category_id', category_id);
        if (search) query = query.ilike('name', `%${search}%`);
        
        const { data: products, error } = await query;
        if (error) throw error;
        
        return res.status(200).json(products || []);

      case 'POST':
        const { variants, images, ...productData } = req.body;
        
        // Create product
        const { data: product, error: productError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        
        if (productError) throw productError;
        
        // Add variants
        if (variants && variants.length > 0) {
          const productVariants = variants.map(v => ({ ...v, product_id: product.id }));
          await supabase.from('product_variants').insert(productVariants);
        }
        
        // Add images
        if (images && images.length > 0) {
          const productImages = images.map(img => ({ ...img, product_id: product.id }));
          await supabase.from('product_images').insert(productImages);
        }
        
        return res.status(201).json(product);

      case 'PUT':
        const { id, variants: updateVariants, images: updateImages, ...updates } = req.body;
        
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        return res.status(200).json(updatedProduct);

      case 'DELETE':
        const { id: deleteId } = req.body;
        await supabase.from('products').delete().eq('id', deleteId);
        return res.status(200).json({ ok: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Products API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
