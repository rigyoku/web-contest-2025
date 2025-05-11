'use client';

import { API } from '@/constants/api';
import { CODE } from '@/constants/code';
import { PATH } from '@/constants/path';
import { useSignInCheck } from '@/hooks/sign-in-check';
import { ClientTokens, saveToken } from '@/utils/client-token';
import '@ant-design/v5-patch-for-react-19';
import { Button, Form, Input, message, Spin } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
    useSignInCheck(false);

    const [messageApi, contextHolder] = message.useMessage();

    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await fetch(API.ADMIN.SIGN_IN, {
                method: 'POST',
                body: JSON.stringify(values),
            });
            if (response.status === 401) {
                const code = await response.json();
                setLoading(false);
                if (code === CODE.ILLEGAL_USERNAME_OR_PASSWORD) {
                    return messageApi.error('登录失败, 请检查用户名和密码');
                } else if (code === CODE.LOCKED_USER) {
                    return messageApi.error('用户锁定中, 稍后再试');
                }
            } else if (!response.ok) {
                setLoading(false);
                return messageApi.error('系统异常, 请联系管理员');
            }
            const result = await response.json() as ClientTokens;
            saveToken(result);
            setLoading(false);
            window.location.pathname = PATH.ADMIN;
        } catch (error) {
            setLoading(false);
            messageApi.error('系统异常, 请联系管理员');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Spin tip="Loading" size="large" spinning={loading}>
            {contextHolder}
            <Form
                name="sign-in"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                style={{
                    width: '300px',
                }}
            >
                <Form.Item style={{ marginBottom: 10 }}>
                    <div style={{
                        fontWeight: 600,
                        fontSize: '24px',
                    }}>嗨，近来可好</div>
                    <div style={{
                        fontWeight: 400,
                        fontSize: '14px',
                    }}>👋 欢迎来到 竞赛用管理系统, 登录以继续</div>
                </Form.Item>

                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                    style={{ marginBottom: 5 }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={<div style={{ display: 'flex', justifyContent: 'space-between', width: '440px', alignItems: 'center' }}>
                        <span>密码</span>
                        <span style={{ color: '#1890ff', cursor: 'pointer', fontSize: '12px' }}>
                            <Link href={PATH.RESET_PASSWORD_RESET}>忘记密码？</Link>
                        </span>
                    </div>}
                    name="password"
                    rules={[{ required: true, message: '请输入密码!' }]}
                    style={{ marginBottom: 24 }}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" block>
                        登录
                    </Button>
                </Form.Item>

                <Form.Item>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 400,
                    }}>如果您还没有账户，请联系管理员</div>
                </Form.Item>

            </Form>
        </Spin>
    );
}