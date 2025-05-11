'use client';

import { API } from '@/constants/api';
import { PATH } from '@/constants/path';
import '@ant-design/v5-patch-for-react-19';
import { Button, Divider, Form, Input, message, Spin } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function Page() {
    const [phase, setPhase] = useState<'send-mail' | 'input-code' | 'reset' | 'done'>('send-mail');
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [mail, setMail] = useState('');
    const [code, setCode] = useState('');
    const sendMail = async (values: any) => {
        setLoading(true);
        try {
            await (await fetch(API.ADMIN.SEND_MAIL_CODE, {
                method: 'POST',
                body: JSON.stringify(values),
            })).json();
            messageApi.success('验证码已发送, 请查收');
            setPhase('input-code');
            setMail(values.mail);
        } catch (error) {
            messageApi.error('系统异常, 请联系管理员');
        }
        setLoading(false);
    }
    const checkCode = async (values: any) => {
        setLoading(true);
        try {
            const res = await (await fetch(API.ADMIN.CHECK_MAIL_CODE, {
                method: 'POST',
                body: JSON.stringify({
                    ...values,
                    mail,
                }),
            })).json();
            if (res) {
                setPhase('reset');
                setCode(values.code);
            } else {
                messageApi.error('验证码错误');
            }
        } catch (error) {
            messageApi.error('系统异常, 请联系管理员');
        }
        setLoading(false);
    }
    const updatePassword = async (values: any) => {
        setLoading(true);
        try {
            await (await fetch(API.ADMIN.RESET_PASSWORD, {
                method: 'POST',
                body: JSON.stringify({
                    ...values,
                    mail,
                    code,
                }),
            })).json();
            setPhase('done');
        } catch (error) {
            messageApi.error('系统异常, 请联系管理员');
        }
        setLoading(false);
    }

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (phase === 'done') {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        window.location.pathname = PATH.SIGN_IN;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [phase]);

    const icon = useMemo(() => {
        if (phase === 'send-mail') {
            return "/lock.svg";
        } else if (phase === 'input-code') {
            return "/mail-code.svg";
        }
    }, [phase]);

    return (
        <Spin tip="Loading" size="large" spinning={loading}>
            {contextHolder}
            {
                icon && <div style={{
                    fontWeight: 600,
                    fontSize: '24px',
                    marginBottom: '14px',
                    boxShadow: '0px 4px 6px -2px rgba(16,24,40,0.03),0px 12px 16px -4px rgba(16,24,40,0.08)',
                    border: '1px solid rgb(232, 232, 232)',
                    borderRadius: '16px',
                    width: '54px',
                    height: '54px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image src={icon} alt='lock' width={24} height={24}></Image>
                </div>
            }
            {
                phase === 'send-mail' ? (
                    <Form
                        name="send-mail"
                        onFinish={sendMail}
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
                                marginBottom: '14px',
                            }}>重置密码</div>
                            <div style={{
                                fontWeight: 400,
                                fontSize: '14px',
                            }}>请输入您的电子邮件地址以重置密码。我们将向您发送一封电子邮件。</div>
                        </Form.Item>

                        <Form.Item
                            label=""
                            name="mail"
                            rules={[{ required: true, message: '请输入邮箱!' }, { type: 'email', message: '请输入正确的邮箱!' }]}
                            style={{ marginBottom: 24 }}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" block>
                                发送验证码
                            </Button>
                        </Form.Item>

                    </Form>
                ) : ''
            }
            {
                phase === 'input-code' ? (
                    <Form
                        name="input-code"
                        onFinish={checkCode}
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
                                marginBottom: '14px',
                            }}>验证您的电子邮件</div>
                            <div style={{
                                fontWeight: 400,
                                fontSize: '14px',
                                marginBottom: '14px',
                            }}>
                                验证码已经发送到您的邮箱 <span style={{
                                    fontWeight: 700,
                                }}>{mail}</span>
                                <br />
                                请注意验证码 5 分钟内有效
                            </div>
                        </Form.Item>

                        <Form.Item
                            label=""
                            name="code"
                            rules={[{ required: true, message: '请输入验证码!' }]}
                            style={{ marginBottom: 24 }}
                        >
                            <Input.OTP
                                separator={(i) => <span style={{ color: i & 1 ? 'red' : 'blue' }}>—</span>}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" block>
                                验证
                            </Button>
                        </Form.Item>
                    </Form>
                ) : ''
            }
            {
                phase === 'reset' ? (
                    <Form
                        name="reset"
                        onFinish={updatePassword}
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
                                marginBottom: '14px',
                            }}>设置密码</div>
                            <div style={{
                                fontWeight: 400,
                                fontSize: '14px',
                            }}>请输入您的新密码</div>
                        </Form.Item>

                        <Form.Item
                            label="新密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="确认密码"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: '请确认密码!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致!'));
                                    },
                                }),
                            ]}
                            style={{ marginBottom: 14 }}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" block>
                                设置密码
                            </Button>
                        </Form.Item>

                    </Form>
                ) : ''
            }
            {
                phase === 'done' ? (
                    <Form
                        name="done"
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
                                marginBottom: '14px',
                            }}>密码设置成功</div>
                            <div style={{
                                fontWeight: 400,
                                fontSize: '14px',
                            }}>{countdown}秒后自动返回登录页</div>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" block onClick={() => window.location.pathname = PATH.SIGN_IN}>
                                返回登录页
                            </Button>
                        </Form.Item>

                    </Form>
                ) : ''
            }
            {
                phase !== 'done' ? (
                    <>
                        <Divider></Divider>
                        <Link href={PATH.SIGN_IN}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 400,
                                color: 'rgb(103, 111, 131)',
                            }}>
                                <Image src={'/back-arrow.svg'} alt='back' width={20} height={20} style={{
                                    padding: '4px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgb(233, 235, 240)',
                                }}></Image>
                                <span style={{
                                    marginLeft: '10px',
                                }}>返回登录</span>
                            </div>
                        </Link>
                    </>
                ) : ''
            }
        </Spin>
    );
}