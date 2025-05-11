import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:30001'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// 连接Redis
await redisClient.connect();

export const Redis = {
    set: async (key: string, value: string, expireMode: string, expireTime: number) => {
        return redisClient.set(key, value, { [expireMode]: expireTime });
    },
    get: async (key: string) => {
        return redisClient.get(key);
    },
    del: async (key: string) => {
        return redisClient.del(key);
    },
    keys: async (pattern: string) => {
        return redisClient.keys(pattern);
    }
};