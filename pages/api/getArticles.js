import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        amount = 10,
        offset = 0,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        keywords,
    } = req.body || {};

    
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: `Invalid amount parameter: ${amount}` });
    }

    if (typeof offset !== 'number' || offset < 0) {
        return res.status(400).json({ error: `Invalid offset parameter: ${offset}` });
    }


     try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(10);
        //.offset(offset);
  
      if (error) {
        throw error;
      }
  
      res.status(200).json({ message: 'Articles retrieved successfully', data });

    } catch (err) {
      console.error('Error retrieving articles:', err);
      res.status(500).json({ error: 'Failed to retrieve articles', details: err.message });
    }

}