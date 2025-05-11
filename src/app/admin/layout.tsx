import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata = {
    title: "后台管理系统",
    description: "网站设计竞赛的后台管理系统",
    icons: {
        icon: "/dashboard-logo.png",
    }
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="">
                <AntdRegistry>
                    {children}
                </AntdRegistry>
            </body>
        </html>
    );
}
