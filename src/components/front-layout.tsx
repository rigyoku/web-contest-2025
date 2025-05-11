'use client';

import { PATH } from '@/constants/path';
import { Button, Layout, Menu } from 'antd';
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import Sider from 'antd/es/layout/Sider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { Header, Content } from 'antd/es/layout/layout';
import { LANG } from '@/languages/lang';
import { DarkSwitch } from "@/components/dark-switch";
import { Languages } from "@/components/languages";

export const FrontLayout = ({
    items,
    children,
    header,
}: { items: ItemType<MenuItemType>[] | undefined, children: ReactNode, lang: LANG, header: ReactNode }) => {
    const path = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed} style={{
            backgroundColor: 'var(--background-weight)',
        }}>
            <div className="demo-logo-vertical" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '8px',
                marginTop: '8px',
            }} >
                <Link href={PATH.HOME} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Image src={'/logo-2.png'} alt='logo' width={48} height={48}></Image>
                    {
                        !collapsed && <span style={{
                            marginLeft: '4px',
                            fontSize: '24px',
                            fontWeight: 600,
                            color: 'var(--foreground-light)',
                        }}>AI Box</span>
                    }
                </Link>
            </div>
            <Menu
                style={{
                    backgroundColor: 'var(--background-weight)',
                }}
                defaultOpenKeys={[path.split('/').slice(0, 3).join('/')]}
                defaultSelectedKeys={[path]}
                triggerSubMenuAction="click"
                theme='light'
                mode="inline"
                items={items}
            >
            </Menu>
        </Sider>
        <Layout style={{
            color: 'var(--foreground-light)',
            backgroundColor: 'var(--background-light)',
        }}>
            <Header style={{
                padding: 0,
                color: 'var(--foreground-light)',
                backgroundColor: 'var(--background-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: collapsed ? '0px' : '16px',
            }}>
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined style={{ backgroundColor: 'var(--icon-background)' }} /> : <MenuFoldOutlined style={{ backgroundColor: 'var(--icon-background)' }} />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                            display: 'inline-block',
                        }}
                    />
                    {header}
                </span>
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '32px',
                }}>
                    <DarkSwitch />
                    <Languages />
                </span>
            </Header>
            <Content
                style={{
                    margin: '4px 16px',
                    padding: 0,
                    minHeight: 280,
                    backgroundColor: 'var(--background-light)',
                }}
            >
                {children}
            </Content>
        </Layout>
    </Layout>
}