import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { ApiResponse, SubscriberPreferences } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, preferences } = req.body as {
    email: string;
    preferences: SubscriberPreferences;
  };

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    // Check if subscriber already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single();

    const typedExisting = existing as { id: number; is_active: boolean } | null;

    if (typedExisting) {
      // Update existing subscriber
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          is_active: true,
          preferences: preferences || {},
        } as never)
        .eq('id', typedExisting.id);

      if (updateError) throw updateError;

      return res.status(200).json({
        message: 'Subscription updated successfully',
      });
    }

    // Create new subscriber
    const { error: insertError } = await supabase.from('subscribers').insert({
      email,
      is_active: true,
      preferences: preferences || {},
    } as never);

    if (insertError) throw insertError;

    res.status(201).json({
      message: 'Successfully subscribed',
    });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({
      error: 'Failed to subscribe',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
