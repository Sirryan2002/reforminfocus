import { LRUCache } from 'lru-cache';
import { NextApiRequest, NextApiResponse } from 'next';

type RateLimitOptions = {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique IPs to track
};

/**
 * Rate limiter using LRU cache
 * Tracks requests per IP address within a time window
 */
export default function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (req: NextApiRequest, res: NextApiResponse, limit: number): Promise<void> =>
      new Promise((resolve, reject) => {
        // Get IP address from request
        const token =
          (req.headers['x-forwarded-for'] as string) ||
          (req.headers['x-real-ip'] as string) ||
          req.socket.remoteAddress ||
          'unknown';

        const tokenCount = tokenCache.get(token) || [0];
        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        // Update cache
        tokenCount[0] = currentUsage + 1;
        tokenCache.set(token, tokenCount);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage);

        if (isRateLimited) {
          res.status(429).json({
            error: 'Too many requests',
            message: 'You have exceeded the rate limit. Please try again later.',
          });
          return reject(new Error('Rate limit exceeded'));
        }

        resolve();
      }),
  };
}

// Pre-configured rate limiters for different use cases
export const contactRateLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export const subscribeRateLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export const searchRateLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});
