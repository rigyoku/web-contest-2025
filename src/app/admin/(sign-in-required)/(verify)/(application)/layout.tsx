'use client';

import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DesktopOutlined,
    SafetyOutlined,
    UserOutlined,
    TeamOutlined,
    PictureOutlined,
    AreaChartOutlined,
    BugOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { AdminHeader } from '@/components/admin-header';
import { useAdminGlobal } from '@/hooks/admin-global';
import Image from 'next/image';
import Link from 'next/link';
import { PATH } from '@/constants/path';
import { usePathname } from 'next/navigation';

const { Header, Sider, Content } = Layout;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const path = usePathname();
    const { adminGlobal: { user: { roles } } } = useAdminGlobal();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} style={{
                backgroundColor: 'rgb(233, 235, 240)',
            }}>
                <div className="demo-logo-vertical" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginBottom: '8px',
                    marginTop: '8px',
                }} >
                    <Link href={PATH.ADMIN} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Image src={'/dashboard-logo.png'} alt='logo' width={48} height={48}></Image>
                        {
                            !collapsed && <span style={{
                                marginLeft: '4px',
                                fontSize: '24px',
                                fontWeight: 600,
                                color: 'var(--foreground)',
                            }}>Dashboard</span>
                        }
                    </Link>
                </div>
                <Menu
                    style={{
                        backgroundColor: 'rgb(233, 235, 240)',
                    }}
                    defaultOpenKeys={[path.split('/').slice(0, 3).join('/')]}
                    defaultSelectedKeys={[path]}
                    triggerSubMenuAction="click"
                    theme='light'
                    mode="inline"
                    items={[
                        {
                            key: '/admin/permission-management',
                            icon: <SafetyOutlined style={{
                                color: 'var(--foreground)',
                            }} />,
                            label: <span style={{
                                color: 'var(--foreground)',
                            }}>权限管理</span>,
                            children: [
                                {
                                    key: PATH.PERMISSION_ROLE,
                                    icon: <TeamOutlined style={{
                                        color: 'var(--foreground)',
                                    }} />,
                                    label: <Link href={PATH.PERMISSION_ROLE}>
                                        角色管理
                                    </Link>,
                                },
                                {
                                    key: PATH.PERMISSION_USER,
                                    icon: <UserOutlined style={{
                                        color: 'var(--foreground)',
                                    }} />,
                                    label: <Link href={PATH.PERMISSION_USER}>
                                        用户管理
                                    </Link>,
                                }
                            ],
                        },
                        {
                            key: '/admin/front-management',
                            icon: <DesktopOutlined style={{
                                color: 'var(--foreground)',
                            }} />,
                            label: <span style={{
                                color: 'var(--foreground)',
                            }}>前端管理</span>,
                            children: [
                                {
                                    key: PATH.FRONT_META,
                                    icon: <BugOutlined style={{
                                        color: 'var(--foreground)',
                                    }} />,
                                    label: <Link href={PATH.FRONT_META}>元信息管理</Link>,
                                },
                                {
                                    key: PATH.FRONT_CATEGORY,
                                    icon: <PictureOutlined style={{
                                        color: 'var(--foreground)',
                                    }} />,
                                    label: <Link href={PATH.FRONT_CATEGORY}>项目类别管理</Link>,
                                },
                                {
                                    key: PATH.FRONT_STATISTICS,
                                    icon: <AreaChartOutlined style={{
                                        color: 'var(--foreground)',
                                    }} />,
                                    label: <Link href={PATH.FRONT_STATISTICS}>访问统计</Link>,
                                },
                            ]
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: collapsed ? '0px' : '16px',
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                            display: 'inline-block',
                        }}
                    />
                    <AdminHeader></AdminHeader>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
