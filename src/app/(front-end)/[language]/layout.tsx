import React from 'react';
import type { Metadata } from "next";
import Link from "next/link";
import Image from 'next/image';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import Client from "@/utils/prisma-client";
import { DEFAULT_META } from "@/constants/front-meta";
import "./globals.css";
import { LANGUAGES } from '@/constants/languages';
import { LANG } from '@/languages/lang';
import { FrontRefresh } from '@/components/front-refresh';
import { PATH } from '@/constants/path';
import { redirect } from 'next/navigation';
import { FrontLayout } from '@/components/front-layout';
import { getLang } from '@/utils/lang';

export const dynamic = 'force-dynamic'; // 强制动态渲染
export const revalidate = 0; // 禁用缓存

// 配置元信息
export async function generateMetadata(): Promise<Metadata> {
    const meta = await Client.meta.findFirst({
        where: {
            path: PATH.HOME,
        },
    });
    const { title, description, keywords, icon } = DEFAULT_META;
    return {
        title: meta?.title || title,
        description: meta?.description || description,
        keywords: meta?.keywords || keywords,
        twitter: {
            title: meta?.title || title,
            description: meta?.description || description,
            images: [meta?.icon || icon],
        },
        icons: {
            icon: meta?.icon || icon,
        },
        openGraph: {
            title: meta?.title || title,
            description: meta?.description || description,
            images: [meta?.icon || icon],
        }
    };
}

// 禁用配置外的路由段
export const dynamicParams = false

// 定义静态路由参数
export function generateStaticParams() {
    const routes = [];
    for (const key in LANGUAGES) {
        const itemKey = key as keyof typeof LANGUAGES;
        routes.push({
            language: itemKey,
        });
    }
    return routes;
}

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ language: string }>;
}>) {
    // 获取多语言配置
    const { language } = await params;
    if (!Object.keys(LANG).includes(language)) {
        redirect(PATH.HOME);
    }
    const lang = await getLang(params);
    const categories = await Client.category.findMany({
        where: {
            deleted: 0,
        }
    });
    return (
        <html lang={language}>
            <body>
                <AntdRegistry>
                    {/* seo优化, 尽量在服务端渲染内容 */}
                    <FrontLayout items={categories.map(({ id, name, icon }) => {
                        return {
                            key: id,
                            icon: icon ? <Image src={icon} alt='icon' width={24} height={24} style={{
                                backgroundColor: 'var(--icon-background)',
                            }}></Image> : undefined,
                            label: <Link href={`/${language}/${id}`} style={{ color: 'var(--foreground-weight)', }}> {name} </Link>,
                        }
                    })} lang={lang} header={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <Link href={'/'} style={{ display: 'flex', alignItems: 'center', marginRight: '24px', color: 'var(--foreground-light)' }}>
                                <Image src={'/fire.png'} alt='hot' width={24} height={24} style={{marginRight: '8px'}}></Image>
                                {lang.hot}
                            </Link>
                            <Link href={'/'} style={{ display: 'flex', alignItems: 'center', color: 'var(--foreground-light)'  }}>
                                <Image src={'/top.png'} alt='top' width={24} height={24} style={{ marginRight: '8px' }}></Image>
                                {lang.top}
                            </Link>
                        </span>
                    }>
                        {/* 注册sse刷新组件 */}
                        <FrontRefresh></FrontRefresh>
                        {children}
                    </FrontLayout>
                </AntdRegistry>
            </body>
        </html>
    );
}
