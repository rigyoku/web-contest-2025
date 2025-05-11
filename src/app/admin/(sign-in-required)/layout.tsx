'use client';

import { GlobalProvider } from "@/hooks/admin-global";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <GlobalProvider>
        {children}
    </GlobalProvider>;
}
