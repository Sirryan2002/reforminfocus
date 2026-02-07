import rateLimit from '@/lib/rateLimit';
import { NextApiRequest, NextApiResponse } from 'next';

describe('Rate Limiter', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let setHeaderMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    setHeaderMock = jest.fn();

    mockReq = {
      headers: {},
      socket: {
        remoteAddress: '127.0.0.1',
      } as any,
    };

    mockRes = {
      status: statusMock,
      setHeader: setHeaderMock,
    };
  });

  it('should allow requests within rate limit', async () => {
    const limiter = rateLimit({
      interval: 60000,
      uniqueTokenPerInterval: 500,
    });

    await limiter.check(
      mockReq as NextApiRequest,
      mockRes as NextApiResponse,
      5
    );

    expect(setHeaderMock).toHaveBeenCalledWith('X-RateLimit-Limit', 5);
    expect(setHeaderMock).toHaveBeenCalledWith('X-RateLimit-Remaining', expect.any(Number));
    expect(statusMock).not.toHaveBeenCalledWith(429);
  });

  it('should block requests exceeding rate limit', async () => {
    const limiter = rateLimit({
      interval: 60000,
      uniqueTokenPerInterval: 500,
    });

    const limit = 3;

    // Make requests up to the limit
    for (let i = 0; i < limit; i++) {
      try {
        await limiter.check(
          mockReq as NextApiRequest,
          mockRes as NextApiResponse,
          limit
        );
      } catch (e) {
        // Ignore rate limit errors for requests within limit
      }
    }

    // The next request should be rate limited
    await expect(
      limiter.check(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        limit
      )
    ).rejects.toThrow('Rate limit exceeded');

    expect(statusMock).toHaveBeenCalledWith(429);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
    });
  });

  it('should set correct rate limit headers', async () => {
    const limiter = rateLimit({
      interval: 60000,
      uniqueTokenPerInterval: 500,
    });

    const limit = 10;

    await limiter.check(
      mockReq as NextApiRequest,
      mockRes as NextApiResponse,
      limit
    );

    expect(setHeaderMock).toHaveBeenCalledWith('X-RateLimit-Limit', limit);
    expect(setHeaderMock).toHaveBeenCalledWith('X-RateLimit-Remaining', expect.any(Number));
  });

  it('should track different IPs separately', async () => {
    const limiter = rateLimit({
      interval: 60000,
      uniqueTokenPerInterval: 500,
    });

    const limit = 2;

    // First IP
    const req1 = {
      ...mockReq,
      socket: { remoteAddress: '192.168.1.1' } as any,
    };

    // Second IP
    const req2 = {
      ...mockReq,
      socket: { remoteAddress: '192.168.1.2' } as any,
    };

    // Both IPs should be able to make requests independently
    await limiter.check(req1 as NextApiRequest, mockRes as NextApiResponse, limit);
    await limiter.check(req1 as NextApiRequest, mockRes as NextApiResponse, limit);

    await limiter.check(req2 as NextApiRequest, mockRes as NextApiResponse, limit);
    await limiter.check(req2 as NextApiRequest, mockRes as NextApiResponse, limit);

    // Both should now be rate limited
    await expect(
      limiter.check(req1 as NextApiRequest, mockRes as NextApiResponse, limit)
    ).rejects.toThrow();

    await expect(
      limiter.check(req2 as NextApiRequest, mockRes as NextApiResponse, limit)
    ).rejects.toThrow();
  });
});
