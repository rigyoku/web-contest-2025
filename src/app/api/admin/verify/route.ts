import { CODE } from '@/constants/code';
import Client from '@/utils/prisma-client';
import { ServerToken } from '@/utils/server-token';
import { NextRequest } from 'next/server';

// 验证是否登录
// 成功时返回不包含密码的用户信息
// 失败时返回401
export const POST = async (req: NextRequest) => {
    const token = req.headers.get('token');
    const userId = token && await ServerToken.verify(token, ServerToken.getIp(req));
    if (userId) {
        const user = await Client.user.findFirst({
            where: {
                id: userId
            }
        });
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return Response.json(userWithoutPassword);
        } else {
            return Response.json(CODE.ILLEGAL_TOKEN, { status: 401 });
        }
    } else {
        return Response.json(CODE.ILLEGAL_TOKEN, { status: 401 });
    }
}