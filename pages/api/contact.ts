import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { supabase } from '@/lib/supabase';
import { contactRateLimiter } from '@/lib/rateLimit';
import type { ApiResponse, ContactFormData, ContactSubmissionInsert } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting: 5 requests per minute per IP
  try {
    await contactRateLimiter.check(req, res, 5);
  } catch {
    return; // Rate limiter already sent response
  }

  const { name, email, subject, message } = req.body as ContactFormData;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters' });
  }

  try {
    const submission: ContactSubmissionInsert = {
      name,
      email,
      subject,
      message,
      is_read: false,
    };

    const { error } = await supabase.from('contact_submissions').insert(submission as never);

    if (error) throw error;

    res.status(201).json({
      message: 'Contact form submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      error: 'Failed to submit contact form',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
