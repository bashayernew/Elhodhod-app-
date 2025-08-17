import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { Redis } from 'ioredis';

type Options = {
  redis?: Redis | null;
  ttlSeconds?: number;
};

export default fp<Options>(async function idempotencyPlugin(app: FastifyInstance, opts: Options) {
  const { redis = null, ttlSeconds = 60 * 10 } = opts;

  app.addHook('onRequest', async (req: FastifyRequest, reply: FastifyReply) => {
    const key = req.headers['idempotency-key'] as string | undefined;
    if (!key || !redis) return;
    const redisKey = `idem:${key}`;
    const existed = await redis.get(redisKey);
    if (existed) {
      reply.code(409).send({ message: 'Duplicate request' });
      return reply; // stop pipeline
    }
    await redis.set(redisKey, '1', 'EX', ttlSeconds, 'NX');
  });
});


