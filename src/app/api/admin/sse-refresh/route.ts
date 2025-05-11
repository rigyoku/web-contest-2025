import { CODE } from "@/constants/code";
import { SSE } from "@/constants/sse";

// 提示刷新的消息列
let messageList: string[] = [];

// 暴露发送刷新消息的方法
export const adminRefresh = async () => {
    messageList.push(CODE.REFRESH);
}

// sse链接
export const GET = async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
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
                    }
                }
                // 清空
                messageList = [];
            }, SSE.LOOP_GAP);

            // 客户端断开时清理
            controller.close = () => {
                clearInterval(intervalId);
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