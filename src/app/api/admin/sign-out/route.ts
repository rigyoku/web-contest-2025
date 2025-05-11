import { CODE } from '@/constants/code';
import { REDIS_KEY } from '@/constants/redis-key';
import { Redis } from '@/utils/redis';
import { ServerToken } from '@/utils/server-token';
import { NextRequest } from 'next/server';

export const cleanAllToken = async (userId: number) => {
    const tokenKeys = await Redis.keys(`${REDIS_KEY.TOKEN}:${userId}*`);
    for (const key of tokenKeys) {
        console.log('clean token key', key);
        await Redis.del(key);
    }
    const refreshTokenKeys = await Redis.keys(`${REDIS_KEY.REFRESH_TOKEN}:${userId}*`);
    for (const key of refreshTokenKeys) {
        console.log('clean refresh token key', key);
        await Redis.del(key);
    }
}

// 登出接口
// 需要验证token
// 清理redis内的token和refreshToken, 所有ip的key均清理掉
export const POST = async (req: NextRequest) => {
    const token = req.headers.get('token');
    const userId = token && await ServerToken.verify(token, ServerToken.getIp(req));
    try {
        if (userId) {
            await cleanAllToken(userId);
            return Response.json(CODE.SUCCESS);
        } else {
            return Response.json(CODE.ILLEGAL_TOKEN, { status: 401 });
        }
    } catch (error) {
        return Response.json(CODE.ERROR, { status: 500 });
    }
}