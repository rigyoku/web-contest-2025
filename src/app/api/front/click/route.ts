import { CODE } from "@/constants/code";
import Client from "@/utils/prisma-client";
import { adminRefresh } from "../../admin/sse-refresh/route";

// 记录前端点击
// 通知admin刷新
export const POST = async (req: Request) => {
    try {
        const { relationId } = await req.json();
        await Client.click_history.create({
            data: {
                relation_id: parseInt(relationId),
                timestamp: new Date(),
            },
        });
        adminRefresh();
        return Response.json(CODE.SUCCESS);
    } catch (error) {
        return Response.json(CODE.ERROR, {status: 500});
    }
}