import jwt from 'jsonwebtoken';
import { Redis } from './redis';
import { NextRequest } from 'next/server';
import { REDIS_KEY } from '@/constants/redis-key';

// token处理工具类
export const ServerToken = {
    // 根据userId和ip生成token和refreshToken
    create: async (userId: number, ip: string) => {
        const token = jwt.sign(
            { userId, ip },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { userId, ip },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '7d' }
        );
        await Redis.set(`${REDIS_KEY.TOKEN}:${userId}${ip}`, token, 'EX', 3600);
        await Redis.set(`${REDIS_KEY.REFRESH_TOKEN}:${userId}${ip}`, refreshToken, 'EX', 604800);
        return {
            token, refreshToken,
        }
    },
    // 通过验证后, 返回userId
    verify: async (token: string, ip: string) => {
        try {
            // 1. 先验证JWT是否有效
            const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, ip: string };
            // 2. 检查Redis中是否存在该Token
            const redisToken = await Redis.get(`${REDIS_KEY.TOKEN}:${userId}${ip}`);
            return redisToken && redisToken === token ? userId : '';
        } catch (err) {
            return '';
        }
    },
    // 刷新token有效且ip相同, 删除当前并生成新的token和refreshToken
    refresh: async (refreshToken: string, ip: string) => {
        try {
            const { userId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: number, ip: string };
            const key = `${REDIS_KEY.REFRESH_TOKEN}:${userId}${ip}`;
            const redisToken = await Redis.get(key);
            if (redisToken && redisToken === refreshToken) {
                Redis.del(key);
                Redis.del(`${REDIS_KEY.TOKEN}:${userId}${ip}`);
                return ServerToken.create(userId, ip);
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    },
    // 获取请求的ip
    getIp: (req: NextRequest) => {
        const ip = req.headers.get('x-real-ip') ||
            req.headers.get('x-forwarded-for')?.split(',')[0] ||
            'unknown';
        return ip;
    }
}