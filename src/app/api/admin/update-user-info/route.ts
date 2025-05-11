import bcrypt from 'bcrypt';
import Client from "@/utils/prisma-client";
import { NextRequest } from "next/server";
import { ServerToken } from '@/utils/server-token';
import { cleanAllToken } from '../sign-out/route';
import { CODE } from '@/constants/code';

// 修改用户信息接口
// 需要验证token
// 修改密码后, 需要清空token来重新登录
export const POST = async (req: NextRequest) => {
    try {
        const token = req.headers.get('token');
        const userId = token && await ServerToken.verify(token, ServerToken.getIp(req));
        if (userId) {
            const { username, password, newPassword } = await req.json();

            if (username) {
                await Client.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        username,
                    },
                });
                return Response.json("success");
            } else if (password && newPassword) {
                const user = await Client.user.findFirst({
                    where: {
                        id: userId,
                    },
                });
                const passwordMatch = await bcrypt.compare(password, user?.password || '');
                if (passwordMatch) {
                    const hashPassword = await bcrypt.hash(newPassword, 10);
                    await Client.user.update({
                        where: {
                            id: userId,
                        },
                        data: {
                            password: hashPassword,
                        },
                    });
                    await cleanAllToken(userId);
                    return Response.json(CODE.SUCCESS);
                } else {
                    return Response.json(CODE.ERROR, { status: 400 });
                }
            } else {
                return Response.json(CODE.ERROR, { status: 400 });
            }
        } else {
            return Response.json(CODE.ERROR, { status: 401 });
        }
    } catch (error) {
        return Response.json(CODE.ERROR, { status: 500 });
    }
}