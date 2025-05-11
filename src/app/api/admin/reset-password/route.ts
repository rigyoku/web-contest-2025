import bcrypt from 'bcrypt';
import Client from "@/utils/prisma-client";
import { NextRequest } from 'next/server';
import { Redis } from '@/utils/redis';
import { CODE } from '@/constants/code';
import { REDIS_KEY } from '@/constants/redis-key';

// 重置密码接口
// 对密码进行hash后进行存储
export const POST = async (req: NextRequest) => {
    const { code, mail, password } = await req.json();
    const checkCode = code === await Redis.get(`${REDIS_KEY.RESET_CODE}:${mail}`);
    if (checkCode) {
        const user = await Client.user.findFirst({
            where: {
                mail,
            },
        });
        if (user) {
            const hashPassword = await bcrypt.hash(password, 10);
            await Client.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashPassword,
                },
            });
            return Response.json(CODE.SUCCESS);
        } else {
            return Response.json(CODE.ERROR, { status: 500 });
        }
    } else {
        return Response.json(CODE.ERROR, { status: 500 });
    }
}