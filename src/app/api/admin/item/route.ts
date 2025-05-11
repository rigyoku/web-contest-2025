import { CODE } from "@/constants/code";
import Client from "@/utils/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { frontRefresh } from "../../front/sse-refresh/route";


// 获取项目列表接口
export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const description = searchParams.get('description');
    const link = searchParams.get('link');
    const categoryId = searchParams.get('categoryId');
    const items = await Client.item.findMany({
        where: {
            AND: [
                categoryId ? { category_id: Number(categoryId) } : {},
                name ? { name: { contains: name } } : {},
                description ? { description: { contains: description } } : {},
                link ? { link: { contains: link } } : {},
                { deleted: 0 }
            ]
        },
    });
    const result = [];
    for (const item of items) {
        const logs = await Client.click_history.findMany({
            where: {
                relation_id: item.id,
            },
        });
        result.push({
            ...item,
            count: logs.length,
        });
    }
    result.sort((a, b) => b.count - a.count);
    return NextResponse.json(result);
}
// 通知前台刷新

// 创建项目接口
export const POST = async (req: NextRequest) => {
    const { name, description, icon, link, categoryId } = await req.json();
    await Client.item.create({
        data: {
            name,
            description,
            icon,
            link,
            category_id: categoryId,
        },
    });
    return NextResponse.json(CODE.SUCCESS);
}

// 修改项目接口
export const PUT = async (req: NextRequest) => {
    const { id, name, description, icon, link, categoryId } = await req.json();
    await Client.item.update({
        where: {
            id,
            deleted: 0,
        },
        data: {
            name,
            description,
            icon,
            link,
            category_id: categoryId,
        },
    });
    frontRefresh();
    return NextResponse.json(CODE.SUCCESS);
}

// 删除项目接口
// 逻辑删除
export const DELETE = async (req: NextRequest) => {
    const { id } = await req.json();
    await Client.item.update({
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