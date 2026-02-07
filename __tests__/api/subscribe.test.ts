import handler from '@/pages/api/subscribe';
import { NextApiRequest, NextApiResponse } from 'next';

// Mock the Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({ data: null })),
        })),
      })),
      insert: jest.fn(() => ({ error: null })),
    })),
  },
}));

// Mock the rate limiter
jest.mock('@/lib/rateLimit', () => ({
  subscribeRateLimiter: {
    check: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('/api/subscribe', () => {
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

  it('should validate email is required', async () => {
    mockReq.body = {
      preferences: {
        weekly_newsletter: true,
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Valid email address is required' });
  });

  it('should validate email format', async () => {
    mockReq.body = {
      email: 'not-an-email',
      preferences: {
        weekly_newsletter: true,
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Valid email address is required' });
  });

  it('should accept valid subscription', async () => {
    mockReq.body = {
      email: 'test@example.com',
      preferences: {
        weekly_newsletter: true,
        article_alerts: false,
        research_updates: false,
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Successfully subscribed',
    });
  });
});
