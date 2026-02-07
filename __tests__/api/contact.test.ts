import handler from '@/pages/api/contact';
import { NextApiRequest, NextApiResponse } from 'next';

// Mock the Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ error: null })),
    })),
  },
}));

// Mock the rate limiter
jest.mock('@/lib/rateLimit', () => ({
  contactRateLimiter: {
    check: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('/api/contact', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    mockReq = {
      method: 'POST',
      body: {},
      headers: {},
      socket: {
        remoteAddress: '127.0.0.1',
      } as any,
    };

    mockRes = {
      status: statusMock,
      json: jsonMock,
      setHeader: jest.fn(),
    };
  });

  it('should reject non-POST requests', async () => {
    mockReq.method = 'GET';

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(405);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('should validate required fields', async () => {
    mockReq.body = {
      name: 'John Doe',
      email: 'john@example.com',
      // Missing subject and message
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'All fields are required' });
  });

  it('should validate email format', async () => {
    mockReq.body = {
      name: 'John Doe',
      email: 'invalid-email',
      subject: 'Test Subject',
      message: 'This is a test message',
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Valid email address is required' });
  });

  it('should validate message length', async () => {
    mockReq.body = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Short',
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Message must be at least 10 characters' });
  });

  it('should accept valid contact form submission', async () => {
    mockReq.body = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a valid test message with more than 10 characters',
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Contact form submitted successfully',
    });
  });
});
