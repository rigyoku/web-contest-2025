import { CODE } from "@/constants/code";
import { adminRefresh } from "../../admin/sse-refresh/route";
import { SSE } from "@/constants/sse";

// 活跃的前端页面数量
export let activeCount = 0;

// 提示刷新的消息列
let messageList: string[] = [];

// 暴露发送刷新消息的方法
export const frontRefresh = async () => {
    messageList.push(CODE.REFRESH);
}

// sse链接
// 通知admin刷新
export const GET = async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            activeCount++;
            console.log('sse start', activeCount);
            adminRefresh();

            // 心跳检测
            const heartbeatInterval = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(':heartbeat\n\n'));
                } catch (error) {
                    cleanup();
                }
            }, SSE.HEART_BEAT);

            const cleanup = () => {
                clearInterval(heartbeatInterval);
                clearInterval(intervalId);
                activeCount--;
                console.log('sse close', activeCount);
                adminRefresh();
            };

            // 循环处理
            const intervalId = setInterval(() => {
                if (messageList.length === 0) {
                    return;
                }
                // 去重再发送
                messageList = Array.from(new Set(messageList));
                for (let i = 0; i < messageList.length; i++) {
                    try {
                        controller.enqueue(encoder.encode(`data: ${messageList[i]}\n\n`));
                    } catch (error) {
                        clearInterval(intervalId);
                        activeCount--;
                        console.log('sse error', activeCount);
                        adminRefresh();
                    }
                }
                // 清空
                messageList = [];
            }, SSE.LOOP_GAP);

            // 客户端断开时清理
            controller.close = () => {
                activeCount--;
                console.log('sse close', activeCount);
                clearInterval(intervalId);
                adminRefresh();
            };
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}