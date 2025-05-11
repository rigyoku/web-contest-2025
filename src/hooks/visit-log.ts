import { API } from "@/constants/api";
import { useEffect } from "react";

// 记录访问路径
export const useVisitLog = (path: string) => {
    useEffect(() => {
        fetch(API.FRONT.VISIT, {
            method: "POST",
            body: JSON.stringify({
                path,
            }),
        });
    }, [path]);
};