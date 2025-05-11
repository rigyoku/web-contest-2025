'use client';

import { API } from "@/constants/api";
import { useSseRefresh } from "@/hooks/sse-refresh";
import { notification } from 'antd';
import { useCallback } from "react";

// 前端刷新组件
export const FrontRefresh = () => {
    const [api, contextHolder] = notification.useNotification();
    const callback = useCallback(() => {
        api.open({
            message: '✨ 网站内容更新啦 ✨',
            duration: 2,
        });
    }, []);
    useSseRefresh(API.FRONT.SSE_REFRESH, callback);
    return <>
        {contextHolder}
    </>;
};