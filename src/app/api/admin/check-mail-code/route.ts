import { CODE } from "@/constants/code";
import { REDIS_KEY } from "@/constants/redis-key";
import { Redis } from "@/utils/redis";
import { NextRequest } from "next/server";

// 校验验证码接口
export const POST = async (req: NextRequest) => {
    const { code, mail } = await req.json();
    try {
        return Response.json(code === await Redis.get(`${REDIS_KEY.RESET_CODE}:${mail}`));
    } catch (error) {
        return Response.json(CODE.ERROR, { status: 500 });
    }
}