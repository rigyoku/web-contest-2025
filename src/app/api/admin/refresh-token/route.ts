import { CODE } from "@/constants/code";
import { ServerToken } from "@/utils/server-token";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const refreshToken = req.headers.get('refreshToken');
    if (refreshToken) {
        const tokens = await ServerToken.refresh(refreshToken, ServerToken.getIp(req));
        if (tokens) {
            return Response.json(tokens);
        } else {
            return Response.json(CODE.ILLEGAL_TOKEN, { status: 401 });
        }
    } else {
        return Response.json(CODE.ILLEGAL_TOKEN, { status: 401 });
    }
}