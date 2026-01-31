import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY // Changed from PUBLISHABLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { articleId } = req.body;

    console.log('Received articleId:', articleId);

    if (!articleId || isNaN(Number(articleId))) {
        return res.status(400).json({ error: `Invalid articleId parameter: ${articleId}` });
    }

    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('easyid', articleId)
            .single(); // Get single record instead of array

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        if (!data) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.status(200).json({ message: 'Article retrieved successfully', data });

    } catch (err) {
        console.error('Error retrieving article:', err);
        res.status(500).json({ error: 'Failed to retrieve article', details: err.message });
    }
}