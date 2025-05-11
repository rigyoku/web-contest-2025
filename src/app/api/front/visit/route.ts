import { CODE } from "@/constants/code";
import Client from "@/utils/prisma-client";

// 记录前端访问次数
export const POST = async (req: Request) => {
    const { path } = await req.json();
    await Client.visit_history.create({
        data: {
            path,
            timestamp: new Date(),
        }
    })
    return Response.json(CODE.SUCCESS);
}