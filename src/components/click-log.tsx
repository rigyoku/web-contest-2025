'use client';

import { useClickLog } from "@/hooks/click-log";
import { ReactNode, useCallback } from "react";

// 点击时记录id
export const ClickLog = ({ relationId, children }: { relationId: string | number, children : ReactNode}) => {
    const onClickLog = useClickLog();
    const onClick = useCallback(() => onClickLog(relationId), [onClickLog, relationId]);
    return <span onClick={onClick}>
        {children}
    </span>
}