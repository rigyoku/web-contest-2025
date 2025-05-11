'use client';

import '../../../globals.css';
import Image from 'next/image';
import { PATH } from '@/constants/path';
import { useAdminGlobal } from '@/hooks/admin-global';
import { Button, Card, Descriptions, Form, Input, Layout, message, Modal, Spin, Tag, theme } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    EditOutlined
} from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { AdminHeader } from '@/components/admin-header';
import { Axios } from '@/utils/client-token';
import { API } from '@/constants/api';

const { Header, Content } = Layout;

export default function Account() {
    const [messageApi, contextHolder] = message.useMessage();
    const { adminGlobal: { user: { username, mail, roles } }, setGlobal } = useAdminGlobal();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [loading, setLoading] = useState(true);

    const [usenameModal, setUsenameModal] = useState({
        isModalOpen: false,
        loading: false,
    });
    const updateUsername = async (values: {
        username: string;
    }) => {
        setUsenameModal(usenameModal => ({
            ...usenameModal,
            loading: true,
        }));
        try {
            await Axios.post(API.ADMIN.UPDATE_USER_INFO, values);
            closeUsernameModal();
            messageApi.success('更新成功');
            setGlobal(adminGlobal => ({
                ...adminGlobal,
                user: {
                    ...adminGlobal.user,
                    username: values.username,
                }
            }));
        } catch (error) {
            setUsenameModal(() => ({
                loading: false,
                isModalOpen: true,
            }));
            messageApi.error('更新失败');
        }
    };
    const closeUsernameModal = () => setUsenameModal(() => ({
        loading: false,
        isModalOpen: false,
    }));
    const openUsernameModal = () => setUsenameModal(() => ({
        loading: false,
        isModalOpen: true,
    }));

    const [roleNames, setRoleNames] = useState(['']);

    useEffect(() => {
        const fetchRoleNames = async () => {
            if (roles.length > 0) {
                const roleNames = await Axios.post<{ name: string }[], { name: string }[]>(API.ADMIN.ROLE_NAMES, roles);
                setRoleNames(roleNames.map(item => item.name));
                setLoading(false);
            }
        };
        fetchRoleNames();
    }, [roles, setRoleNames, setLoading]);

    const [passwordModal, setPasswordModal] = useState({
        isModalOpen: false,
        loading: false,
    });
    const updatePassword= async (values: {
        password: string;
        newPassword: string;
    }) => {
        setPasswordModal(passwordModal => ({
            ...passwordModal,
            loading: true,
        }));
        try {
            await Axios.post(API.ADMIN.UPDATE_USER_INFO, values);
            messageApi.success('更新成功, 请重新登录');
            closePasswordModal();
            setTimeout(() => {
                window.location.pathname = PATH.SIGN_IN;
            }, 1000);
        } catch (error) {
            setPasswordModal(() => ({
                loading: false,
                isModalOpen: true,
            }));
            messageApi.error('更新失败');
        }
    };
    const closePasswordModal = () => setPasswordModal(() => ({
        loading: false,
        isModalOpen: false,
    }));
    const openPasswordModal = () => setPasswordModal(() => ({
        loading: false,
        isModalOpen: true,
    }));


    return (
        <Layout style={{ minHeight: '100vh' }}>
            {contextHolder}
            <Modal
                title="编辑名字"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={usenameModal.isModalOpen}
                onCancel={closeUsernameModal}
                footer=''
            >
                <Spin spinning={usenameModal.loading}>
                    <Form
                        name="update-username"
                        onFinish={updateUsername}
                        initialValues={{
                            username,
                        }}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            layout='horizontal'
                            label="用户名"
                            name='username'
                            style={{ marginTop: 20, marginBottom: 20 }}>
                            <Input></Input>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" block>
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                    
                </Spin>
            </Modal>

            <Modal
                title="修改密码"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={passwordModal.isModalOpen}
                onCancel={closePasswordModal}
                footer=''
            >
                <Spin spinning={passwordModal.loading}>
                    <Form
                        name="update-password"
                        onFinish={updatePassword}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="原密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="新密码"
                            name="newPassword"
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
                                        if (!value || getFieldValue('newPassword') === value) {
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
                                保存
                            </Button>
                        </Form.Item>
                    </Form>

                </Spin>
            </Modal>

            <Header style={{
                padding: 0,
                background: colorBgContainer,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '16px',
            }}>
                <div className="demo-logo-vertical" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }} >
                    <Link href={PATH.ADMIN} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Image src={'/dashboard-logo.png'} alt='logo' width={48} height={48}></Image>
                        <span style={{
                            marginLeft: '4px',
                            fontSize: '24px',
                            fontWeight: 600,
                            color: 'var(--foreground)',
                        }}>Dashboard</span>
                    </Link>
                </div>
                <AdminHeader showAccountSetting={false} ></AdminHeader>
            </Header>
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Card loading={loading} variant='borderless' style={{
                    width: '600px',
                    height: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Descriptions title="我的账户" items={[
                        {
                            key: '1',
                            label: '用户名',
                            span: 'filled',
                            children: <div>
                                <span style={{
                                    fontWeight: 600,
                                    marginRight: '8px',
                                }}>{username}</span>
                                <EditOutlined style={{
                                    cursor: 'pointer',
                                }} onClick={openUsernameModal} />
                            </div>,
                        },
                        {
                            key: '2',
                            label: '邮箱',
                            span: 'filled',
                            children: <div>
                                <span style={{
                                    fontWeight: 600,
                                    marginRight: '8px',
                                }}>{mail}</span>
                            </div>,
                        },
                        {
                            key: '3',
                            label: '密码',
                            span: 'filled',
                            children: <Button color="default" variant="filled" size='small' onClick={openPasswordModal}>修改密码</Button>,
                        },
                        {
                            key: '4',
                            label: '角色',
                            span: 'filled',
                            children: <>
                                {
                                    roleNames.map((roleName, index) => (
                                        <Tag key={index}>{roleName}</Tag>
                                    ))
                                }
                            </>,
                        },
                    ]} />
                </Card>
            </Content>
        </Layout>
    );
}