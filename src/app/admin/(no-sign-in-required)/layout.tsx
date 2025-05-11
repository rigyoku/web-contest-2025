'use client';

import Image from 'next/image';

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div style={{
            backgroundColor: 'rgb(233, 235, 240)',
            padding: '24px',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgb(252, 252, 253)',
                border: '1px solid rgb(255, 255, 255)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <header style={{
                    padding: '24px',
                }}>
                    <Image src={'/dashboard-logo.png'} alt='logo' width={24} height={24}></Image>
                </header>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                }}>
                    {children}
                </div>
                <footer style={{
                    padding: '24px',
                    fontSize: '12px',
                    fontWeight: 400,
                }}>
                    <span>© 2025 Liy, Ltd. All rights reserved.</span>
                </footer>
            </div>
        </div>
    );
}
