import { CODE } from "@/constants/code";
import Client from "@/utils/prisma-client";
import { Sql } from "@prisma/client/runtime/client";
import { NextRequest, NextResponse } from "next/server";

// 获取点击记录接口
export const POST = async (req: NextRequest) => {
    const { code, name, startTime, endTime } = await req.json();


    // 根据名称模糊匹配id
    const items = await Client.item.findMany({
        where: {
            AND: [
                name ? { name: { contains: name } } : {},
                { deleted: 0 }
            ]
        }
    });

    if (code === CODE.STATISTICS_NO_GROUP || code === CODE.STATISTICS_SCATTER) {
        // 根据id和时间戳获取所有数据
        const logs = await Client.click_history.findMany({
            where: {
                relation_id: {
                    in: items.map(item => item.id),
                },
                timestamp: {
                    gt: startTime ? new Date(startTime) : undefined,
                    lt: endTime ? new Date(endTime) : undefined,
                }
            }
        });
        const result = [];
        for (const log of logs) {
            const item = items.find(item => item.id === log.relation_id);
            if (item) {
                result.push({
                    ...log,
                    name: item.name,
                    key: log.id,
                });
            }
        }
        return NextResponse.json(result);
    } else if (code === CODE.STATISTICS_BY_DAY) {
        const sql = `
            SELECT
                DATE(timestamp) as date,
                COUNT(*) as count
            FROM
                web_contest.click_history
            WHERE
                ${items.length > 0 ? `relation_id IN (${items.map(item => item.id).join(',')})` : '1=1'}
                ${startTime ? ` AND timestamp > '${new Date(startTime).toISOString()}'` : ''}
                ${endTime ? ` AND timestamp < '${new Date(endTime).toISOString()}'` : ''}
            GROUP BY 
                DATE(timestamp)
            ORDER BY 
                date ASC
        `;
        const countByDay = (await Client.$queryRaw<any>(new Sql([sql], []))).map((item: any) => ({
            date: item.date,
            count: Number(item.count)
        }));
        return NextResponse.json(countByDay);
    } else if (code === CODE.STATISTICS_BY_TYPE) {
        const sql = `
            SELECT
                relation_id,
                COUNT(*) as count
            FROM
                web_contest.click_history
            WHERE
                ${items.length > 0 ? `relation_id IN (${items.map(item => item.id).join(',')})` : '1=1'}
                ${startTime ? ` AND timestamp > '${new Date(startTime).toISOString()}'` : ''}
                ${endTime ? ` AND timestamp < '${new Date(endTime).toISOString()}'` : ''}
            GROUP BY 
                relation_id
            ORDER BY 
                count ASC
        `;
        const countByType = (await Client.$queryRaw<any>(new Sql([sql], []))).map((log: any) => ({
            name: items.find(item => item.id === log.relation_id)?.name,
            count: Number(log.count)
        }));
        return NextResponse.json(countByType);
    }
    return NextResponse.json(CODE.ERROR, { status: 400 });

}
