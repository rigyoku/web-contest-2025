'use client';

import { Card, Col, Row, Statistic, StatisticProps } from 'antd';
import CountUp from 'react-countup';
import { Line, Pie } from '@ant-design/plots';
import { format } from 'fecha';
import { API } from '@/constants/api';
import { useSseRefresh } from '@/hooks/sse-refresh';

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
);

export type VisitDayLog = {
    date: Date,
    count: number,
}

export type ClickNameLog = {
    name: string,
    count: number,
}

type DashboardProps = {
    visitCount: number,
    activeCount: number,
    lockedUserCount: number,
    visitDayLog: VisitDayLog[],
    clickNameLog: ClickNameLog[],
}

export const Dashboard = ({ visitCount, activeCount, lockedUserCount, visitDayLog, clickNameLog }: DashboardProps) => {
    useSseRefresh(API.ADMIN.SSE_REFRESH);
    const lineConfig = {
        data: visitDayLog,
        xField: (d: VisitDayLog) => {
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
    const pieConfig = {
        data: clickNameLog,
        angleField: 'count',
        colorField: 'name',
        height: 200,
        radius: 0.8,
        label: {
            text: (d: ClickNameLog) => `${d.name}${d.count}`,
            fontSize: 8,
            position: 'outside',
        },
        legend: null,
    };
    return <div style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <Card variant='borderless'>
                    <Statistic title={<span style={{
                        fontWeight: 700,
                        color: 'var(--foreground)'
                    }}>总访问量</span>} value={visitCount} formatter={formatter} />
                </Card>
            </Col>
            <Col span={8}>
                <Card variant='borderless'>
                    <Statistic title={<span style={{
                        fontWeight: 700,
                        color: 'var(--foreground)'
                    }}>当前活跃量</span>} value={activeCount} formatter={formatter} />
                </Card>
            </Col>
            <Col span={8}>
                <Card variant='borderless'>
                    <Statistic title={<span style={{
                        fontWeight: 700,
                        color: 'var(--foreground)'
                    }}>锁定的账户数</span>} value={lockedUserCount} formatter={formatter} />
                </Card>
            </Col>
        </Row>
        <Row gutter={[16, 16]} style={{
            marginTop: 24,
        }}>
            <Col span={16}>
                <Card variant='borderless' title='前端每日访问量'>
                    <Line {...lineConfig}></Line>
                </Card>
            </Col>
            <Col span={8}>
                <Card variant='borderless' title="前端访问比例">
                    <Pie {...pieConfig}></Pie>
                </Card>
            </Col>
        </Row>
    </div>
}