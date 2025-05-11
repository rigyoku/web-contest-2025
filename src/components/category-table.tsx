'use client';

import { AppstoreAddOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { API } from '@/constants/api';
import '@ant-design/v5-patch-for-react-19';
import { Button, Col, Form, Input, message, Modal, Row, Spin, Table } from 'antd';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { PATH } from '@/constants/path';
import { useUploadImage } from '@/hooks/upload-image';
import TextArea from 'antd/es/input/TextArea';

type CategoryTableProps = {
    id: number,
    path: string,
    name: string,
    description: string | null,
    icon: string | null,
};

const columns = [
    {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '图标',
        dataIndex: 'icon',
        key: 'icon',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: '28%',
    },
];

export const CategoryTable = ({ categories }: { categories: CategoryTableProps[] }) => {

    const [form] = Form.useForm();

    // 弹窗
    const [modalForm] = Form.useForm();
    const [selectCategory, setSelectCategory] = useState({} as CategoryTableProps);
    const { imageUrl, setImageUrl, uploadComponent } = useUploadImage({
        defaultUrl: selectCategory.icon
    });
    useEffect(() => {
        setImageUrl(selectCategory.icon);
    }, [selectCategory.icon, setImageUrl]);
    const [modal, setModal] = useState<{
        isModalOpen: boolean,
        type: 'add' | 'update',
        loading: boolean,
    }>({
        isModalOpen: false,
        type: 'add',
        loading: false,
    });
    
    useEffect(() => {
        if (modal.isModalOpen) {
            modalForm.setFieldsValue(selectCategory);
        }
    }, [modalForm, modal.isModalOpen, selectCategory]);

    const commit = async (values: {
        password: string;
        newPassword: string;
    }) => {
        setModal(modal => ({
            ...modal,
            loading: true,
        }));
        try {
            if (modal.type === 'add') {
                await axios.post(API.ADMIN.CATEGORY, {
                    ...values,
                    icon: imageUrl,
                    path: PATH.HOME,
                });
                messageApi.success('新增成功');
            } else {
                await axios.put(API.ADMIN.CATEGORY, {
                    ...values,
                    icon: imageUrl,
                    id: selectCategory.id,
                    path: selectCategory.path,
                });
                messageApi.success('更新成功');
            }
            form.submit();
            closeModal();
        } catch (error) {
            setModal((model) => ({
                ...model,
                loading: false,
                isModalOpen: true,
            }));
            messageApi.error('更新失败');
        }
    };
    const closeModal = () => setModal((model) => ({
        ...model,
        loading: false,
        isModalOpen: false,
    }));
    const openModal = (type: 'add' | 'update') => setModal(() => ({
        type,
        loading: false,
        isModalOpen: true,
    }));

    // 主列表
    const [dataSource, setDataSource] = useState<any>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const getDatasource = useCallback((categories: CategoryTableProps[]) => {
        const dataSource = [];
        for (const { id, name, description, icon, path } of categories) {
            dataSource.push({
                key: id,
                name,
                description,
                icon: icon && <Image src={icon} alt="icon" width={32} height={32} />,
                action: (<>
                    <Button style={{ marginRight: '10px' }} onClick={() => {
                        setSelectCategory({
                            id,
                            name,
                            description,
                            icon,
                            path,
                        });
                        openModal('update');
                    }}>修改</Button>
                    <Button style={{ marginRight: '10px' }}>
                        <Link href={`${PATH.FRONT_CATEGORY}/${id}`}>详细</Link>
                    </Button>
                    <Button danger onClick={async () => {
                        try {
                            setLoading(true);
                            await axios.delete(API.ADMIN.CATEGORY, {
                                data: {
                                    id,
                                },
                            });
                            messageApi.success('删除成功');
                            form.submit();
                        } catch (error) {
                            setLoading(false);
                            messageApi.error('系统异常, 请联系管理员');
                        }
                    }}>删除</Button>
                </>),
            });
        }
        setDataSource(dataSource);
    }, [setLoading, messageApi, setDataSource, setSelectCategory, openModal, form]);

    useEffect(() => {
        getDatasource(categories);
    }, []);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const categories = await axios.get<CategoryTableProps[]>(API.ADMIN.CATEGORY, {
                params: {
                    ...values,
                },
            });
            getDatasource(categories.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            messageApi.error('系统异常, 请联系管理员');
        }
    };

    return (
        <Spin tip="Loading" size="large" spinning={loading}>
            {contextHolder}
            <Modal
                title={modal.type === 'add' ? '新增类别' : '修改类别'}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={modal.isModalOpen}
                onCancel={closeModal}
                footer=''
            >
                <Spin spinning={modal.loading}>
                    <Form
                        name="category-modal"
                        form={modalForm}
                        onFinish={commit}
                        initialValues={modal.type === 'add' ? {} : selectCategory}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="标题"
                            name='name'
                            rules={[{ required: true, message: '请输入标题!' }]}
                            style={{ marginTop: 20, marginBottom: 20 }}>
                            <Input></Input>
                        </Form.Item>
                        <Form.Item
                            label="描述"
                            name='description'
                            style={{ marginTop: 20, marginBottom: 20 }}>
                            <TextArea></TextArea>
                        </Form.Item>
                        <Form.Item
                            label="图标"
                        >
                            {uploadComponent}
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" block>
                                {modal.type === 'add' ? '创建' : '提交'}
                            </Button>
                        </Form.Item>
                    </Form>

                </Spin>
            </Modal>
            <Form
                name="fetch-categories"
                onFinish={onFinish}
                autoComplete="off"
                layout="inline"
                form={form}
            >
                <Row gutter={[16, 16]} style={{
                    width: '100%',
                    marginBottom: '16px',
                }}>
                    <Col>
                        <Form.Item
                            label="标题"
                            name="name"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label="描述"
                            name="description"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                <SearchOutlined />检索
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col style={{ display: 'flex', alignContent: 'space-between', flexGrow: 1 }}>
                        <Form.Item>
                            <Button block onClick={() => {
                                form.resetFields();
                                form.submit();
                            }}>
                                <DeleteOutlined />重置
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col style={{ display: 'flex', alignContent: 'space-between' }}>
                        <Form.Item>
                            <Button type="primary" block onClick={() => {
                                setSelectCategory({
                                    id: 0,
                                    name: '',
                                    description: null,
                                    icon: null,
                                    path: '',
                                });
                                openModal('add');
                            }}>
                                <AppstoreAddOutlined />新增
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table dataSource={dataSource} columns={columns} pagination={
                {
                    pageSize: 5,
                }
            } />
        </Spin>
    );
}