export const rateLimitConfig = {
  throttlers: [
    {
      ttl: 60000,
      limit: 10,
    },
  ],
};
