'use client';

import { useAdminGlobal } from "@/hooks/admin-global";
import { useSignInCheck } from "@/hooks/sign-in-check";
import { Spin } from 'antd';

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useSignInCheck(true);
    const { adminGlobal: { loading } } = useAdminGlobal();
    return <Spin tip="Loading" size="large" spinning={loading}>
        {children}
    </Spin>;
}
