import { CODE } from "@/constants/code";
import Client from "@/utils/prisma-client";
import { NextRequest } from "next/server";

// 获取角色名接口
export const POST = async (req: NextRequest) => {
    try {
        const { roles } = await req.json();
        const names = await Client.role.findMany({
            where: {
                id: {
                    in: roles
                }
            },
            select: {
                name: true
            }
        })
        return Response.json(names);
    } catch (error) {
        return Response.json(CODE.ERROR, { status: 500 });
    }
}