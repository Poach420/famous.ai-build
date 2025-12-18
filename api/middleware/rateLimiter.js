const requestCounts = new Map();

export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // 100 requests per minute

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const requests = requestCounts.get(ip);
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later'
    });
  }

  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    for (const [key, times] of requestCounts.entries()) {
      const validTimes = times.filter(time => now - time < windowMs);
      if (validTimes.length === 0) {
        requestCounts.delete(key);
      } else {
        requestCounts.set(key, validTimes);
      }
    }
  }

  next();
};
