import { API } from "@/constants/api";
import { useCallback } from "react";

// 记录点击的id
export const useClickLog = () => {
    const onClickLog = useCallback(async (relationId: number | string) => {
        await fetch(API.FRONT.CLICK, {
            method: "POST",
            body: JSON.stringify({
                relationId,
            }),
        });
    }, [])
    return onClickLog;
};