import { CODE } from "@/constants/code";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// 数据更新时, 服务端刷新并执行回调
export const useSseRefresh = (url: string, callback?: (data: any) => void) => {
    const router = useRouter();
    useEffect(() => {
        const eventSource = new EventSource(url);
        eventSource.addEventListener('message', (event) => {
            if (event.data === CODE.REFRESH) {
                callback?.(event.data);
                router.refresh();
            }
        });
        return () => {
            eventSource.close();
        };
    }, [url, callback, router]);
};