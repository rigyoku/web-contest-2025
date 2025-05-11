'use client';

import { API } from '@/constants/api';
import { PATH } from '@/constants/path';
import { useAdminGlobal } from '@/hooks/admin-global';
import { Axios, cleanToken } from '@/utils/client-token';
import {
    DownOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Space, } from 'antd';

import Link from 'next/link';
import { useCallback } from 'react';

// 管理端的头部栏
export const AdminHeader = ({ showAccountSetting = true }: { showAccountSetting?: boolean }) => {
    const { adminGlobal: { user: { username } }, setGlobal } = useAdminGlobal();
    const signOut = useCallback(async () => {
        setGlobal(global => ({
            ...global,
            loading: true,
        }));
        try {
            await Axios.post(API.ADMIN.SIGN_OUT)
        } catch (error: any) {
            // 退出登录的异常可以忽略了
        };
        setGlobal(global => ({
            ...global,
            loading: false,
        }));
        cleanToken();
    }, [setGlobal]);
    const items = showAccountSetting ? [
        {
            key: '1',
            label: (
                <Link href={PATH.ACCOUNT}>账户设置</Link>
            ),
        }
    ] : [];
    return (
        <div style={{
            display: 'inline-block',
        }}>
            <Dropdown menu={{
                items: [
                    ...items,
                    {
                        key: '2',
                        label: (
                            <div onClick={signOut}>
                                退出登录
                            </div>
                        ),
                    }
                ]
            }}>
                <Space style={{
                    height: '24px',
                    marginRight: '16px',
                }}>
                    <Avatar style={{ backgroundColor:'rgb(119, 184, 224)', verticalAlign: 'middle' }} size="large" gap={1}>
                        <span style={{
                            fontWeight: 700,
                            fontSize: '28px',
                            lineHeight: '28px',
                        }}>
                            {username[0]}
                        </span>
                    </Avatar>
                    <span style={{
                        fontWeight: 700,
                    }}>
                        {username}
                    </span>
                    <DownOutlined />
                </Space>
            </Dropdown>
        </div>
    );
}