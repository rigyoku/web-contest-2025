import { CODE } from "@/constants/code";
import Client from "@/utils/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { frontRefresh } from "../../front/sse-refresh/route";

// 更新元信息接口
// 通知前台刷新
export const POST = async (req: NextRequest) => {
    const { path, title, description, keywords, icon } = await req.json();
    await Client.meta.update({
        where: {
            path: path,
        },
        data: {
            title,
            description,
            keywords,
            icon,
        }
    });
    frontRefresh();
    return NextResponse.json(CODE.SUCCESS)
}