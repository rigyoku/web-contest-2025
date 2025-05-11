import bcrypt from 'bcrypt';
import Client from "@/utils/prisma-client";
import { ServerToken } from '@/utils/server-token';
import { NextRequest } from 'next/server';
import { Redis } from '@/utils/redis';
import { CODE } from '@/constants/code';
import { REDIS_KEY } from '@/constants/redis-key';
import { adminRefresh } from '../sse-refresh/route';

const LOCK_TIMES = 4;

const checkLock = async (userId: number | string) => {
    return await Redis.get(`${REDIS_KEY.LOCKED_USER}:${userId}`) === null;
}

const lockUser = async (userId: number | string) => {
    adminRefresh();
    await Redis.set(`${REDIS_KEY.LOCKED_USER}:${userId}`, `locked`, 'EX', 60 * 60 * 24);
}

const tryCount = async (userId: number | string, ip: string) => {
    const tryCountKey = `${REDIS_KEY.TRY_COUNT}:${userId}:${ip}`;
    const count = await Redis.get(tryCountKey);
    const currentCount = parseInt(count || '0') + 1;
    if (currentCount >= LOCK_TIMES) {
        await lockUser(userId);
        await Redis.del(tryCountKey);
    } else {
        await Redis.set(tryCountKey, `${currentCount}`, 'EX', 60 * 5);
    }
}

// 登录接口
// 根据用户名查找用户, 进行密码的hash对比
// 登录成功后发放token和refreshToken
// 登录失败次数过多会锁定账户, 通知admin刷新
export const POST = async (req: NextRequest) => {
    const { username, password } = await req.json();
    const user = await Client.user.findFirst({
        where: {
            username,
        },
    });
    if (user) {
        if (await checkLock(user.id)) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            const ip = ServerToken.getIp(req);
            if (passwordMatch) {
                const tokens = await ServerToken.create(user.id, ip);
                return Response.json(tokens);
            } else {
                tryCount(user.id, ip);
                return Response.json(CODE.ILLEGAL_USERNAME_OR_PASSWORD, { status: 401 });
            }
        } else {
            return Response.json(CODE.LOCKED_USER, { status: 401 });
        }
    } else {
        if (await checkLock(`${username}-${username}`)) {
            const ip = ServerToken.getIp(req);
            tryCount(`${username}-${username}`, ip);
            return Response.json(CODE.ILLEGAL_USERNAME_OR_PASSWORD, { status: 401 });
        } else {
            return Response.json(CODE.LOCKED_USER, { status: 401 });
        }
    }
}