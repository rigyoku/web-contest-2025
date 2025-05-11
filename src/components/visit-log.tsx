'use client';

import { useVisitLog } from "@/hooks/visit-log";

// 记录访问路径
export const ClickLog = (path: string) => {
    useVisitLog(path);
    return <></>;
}