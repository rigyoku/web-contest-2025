'use client';

import { API } from '@/constants/api';
import '@ant-design/v5-patch-for-react-19';
import { Button, Card, Form, Input, message, Spin } from 'antd';
import { useState } from 'react';
import { useUploadImage } from '@/hooks/upload-image';
import TextArea from 'antd/es/input/TextArea';

type MetaFormProps = {
    path: string;
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    icon?: string | null;
}

export const MetaForm = (meta: MetaFormProps) => {

    const [messageApi, contextHolder] = message.useMessage();

    const { imageUrl, uploadComponent } = useUploadImage({
        defaultUrl: meta.icon
    });

    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await fetch(API.ADMIN.UPDATE_META, {
                method: 'POST',
                body: JSON.stringify({
                    ...values,
                    path: meta.path,
                    icon: imageUrl,
                }),
            });
            messageApi.success('更新成功');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            messageApi.error('系统异常, 请联系管理员');
        }
    };

    return (
        <Spin tip="Loading" size="large" spinning={loading}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Card style={{
                    width: '400px',
                }}>
                    {contextHolder}
                    <Form
                        name="update-meta"
                        onFinish={onFinish}
                        initialValues={meta}
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
                            }}>
                                元信息管理
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="标题"
                            name="title"
                            style={{ marginBottom: 5 }}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="描述"
                            name="description"
                            style={{ marginBottom: 5 }}
                        >
                            <TextArea></TextArea>
                        </Form.Item>

                        <Form.Item
                            label="关键字"
                            name="keywords"
                            style={{ marginBottom: 5 }}
                        >
                            <TextArea></TextArea>
                        </Form.Item>

                        <Form.Item label="图标">
                            {uploadComponent}
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" block>
                                提交
                            </Button>
                        </Form.Item>

                    </Form>
                </Card>
            </div>
        </Spin>
    );
}