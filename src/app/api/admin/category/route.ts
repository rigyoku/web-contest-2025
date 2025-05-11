import { CODE } from "@/constants/code";
import Client from "@/utils/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { frontRefresh } from "../../front/sse-refresh/route";

// 获取类别列表接口
export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const description = searchParams.get('description');
    console.log(name, description);
    const categories = await Client.category.findMany({
        where: {
            AND: [
                name ? { name: { contains: name } } : {},
                description ? { description: { contains: description } } : {},
                { deleted: 0 }
            ]
        }
    });
    return NextResponse.json(categories);
}

// 通知前台刷新

// 创建类别接口
export const POST = async (req: NextRequest) => {
    const { path, name, description, icon } = await req.json();
    await Client.category.create({
        data: {
            path,
            name,
            description,
            icon,
        }
    });
    return NextResponse.json(CODE.SUCCESS);
}

// 修改类别接口
export const PUT = async (req: NextRequest) => {
    const { id, path, name, description, icon } = await req.json();
    await Client.category.update({
        where: {
            id,
            deleted: 0,
        },
        data: {
            path,
            name,
            description,
            icon,
        },
    });
    frontRefresh();
    return NextResponse.json(CODE.SUCCESS);
}

// 删除类别接口
// 逻辑删除
export const DELETE = async (req: NextRequest) => {
    const { id } = await req.json();
    await Client.category.update({
        where: {
            id,
        },
        data: {
            deleted: 1,
        }
    });
    frontRefresh();
    return NextResponse.json(CODE.SUCCESS);
}