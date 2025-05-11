'use client';

import { AppstoreAddOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { API } from '@/constants/api';
import '@ant-design/v5-patch-for-react-19';
import { Button, Col, Form, Input, message, DatePicker, Row, Spin, Table, Select } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { CODE } from '@/constants/code';
import { Column, Line, Scatter } from '@ant-design/charts';

const { RangePicker } = DatePicker;

const columns = [
    {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
    },
];

const lineConfig = {
    xField: (d: any) => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    yField: 'count',
    sizeField: 'count',
    shapeField: 'trail',
    legend: { size: false },
    style: {
        fill: '#abc',
    },
    height: 200,
    tooltip: {
        channel: 'y',
        name: '单日访问量',
    },
};

const barConfig = {
    xField: 'name',
    yField: 'count',
    label: {
        text: (d: any) => d.name,
        textBaseline: 'bottom',
    },
    axis: {
        y: {
            labelFormatter: '.0%',
        },
    },
    style: {
        // 圆角样式
        radiusTopLeft: 10,
        radiusTopRight: 10,
    },
    height: 400,
}

const scatterConfig = {
    xField: 'timestamp',
    yField: 'name',
    colorField: 'name',
    height: 400,
}

export default function Statistics() {

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const [code, setCode] = useState(CODE.STATISTICS_NO_GROUP);
    const [logList, setLogList] = useState([]);
    const [dayList, setDayList] = useState([]);
    const [typeList, setTypeList] = useState([]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const { data } = await axios.post(API.ADMIN.STATISTICS, {
                ...values,
                startTime: values.date ? values.date[0]?.$d : undefined,
                endTime: values.date ? values.date[1]?.$d : undefined,
            });
            setCode(values.code);
            if (values.code === CODE.STATISTICS_NO_GROUP || values.code === CODE.STATISTICS_SCATTER) {
                setLogList(data.map((item: any) => {
                    item.timestamp = new Date(item.timestamp).toLocaleString();
                    return item;
                }));
            } else if (values.code === CODE.STATISTICS_BY_DAY) {
                setDayList(data);
            } else if (values.code === CODE.STATISTICS_BY_TYPE) {
                setTypeList(data);
            }
            
            setLoading(false);
        } catch (error) {
            setLoading(false);
            messageApi.error('系统异常, 请联系管理员');
        }
    };

    return <Spin tip="Loading" size="large" spinning={loading}>
        {contextHolder}
        <Form
            name="fetch-categories"
            onFinish={onFinish}
            initialValues={{
                code: CODE.STATISTICS_NO_GROUP,
            }}
            autoComplete="off"
            layout="inline"
            form={form}
            style={{
                marginBottom: '16px',
            }}
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
                        label="时间范围"
                        name='date'
                    >
                        <RangePicker showTime allowEmpty={[true, true]} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Item
                        label="视图类型"
                        name="code"
                    >
                        <Select
                            options={[
                                { value: CODE.STATISTICS_NO_GROUP, label: 'Log列表' },
                                { value: CODE.STATISTICS_BY_DAY, label: '按天聚合' },
                                { value: CODE.STATISTICS_BY_TYPE, label: '按类聚合' },
                                { value: CODE.STATISTICS_SCATTER, label: '散点视图' },
                            ]} style={{ width: 120 }}>
                        </Select>
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
            </Row>
        </Form>
        {
            code === CODE.STATISTICS_NO_GROUP && <Table style={{
                marginTop: '14px',
            }} dataSource={logList} columns={columns}></Table>
        }
        {
            code === CODE.STATISTICS_BY_DAY && <Line {...lineConfig} data={dayList}></Line>
        }
        {
            code === CODE.STATISTICS_BY_TYPE && (<>
                <Column {...barConfig} data={typeList}></Column>
            </>)
        }
        {
            code === CODE.STATISTICS_SCATTER && <Scatter {...scatterConfig} data={logList}></Scatter>
        }
    </Spin>;
}