import { ClickLog } from "@/components/click-log";
import { PATH } from "@/constants/path";
import Client from "@/utils/prisma-client";
import Link from "next/link";
import { Avatar, Card, Col, Row, Tooltip } from 'antd';
import { redirect } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { API } from "@/constants/api";
import { ClientItem } from "./type";

export const dynamic = 'force-dynamic'; // 强制动态渲染
export const revalidate = 0; // 禁用缓存

export default async function Item({ params }: Readonly<{
    params: Promise<{ language: string, category_id: string }>;
}>) {
    const { category_id } = await params;
    const category = await Client.category.findFirst({
        where: {
            id: parseInt(category_id),
            deleted: 0,
        },
    });
    if (!category) {
        redirect(PATH.HOME);
    }
    const items = await Client.item.findMany({
        where: {
            category_id: parseInt(category_id),
            deleted: 0,
        },
    });
    const result = [];
    for (const item of items) {
        const logs = await Client.click_history.findMany({
            where: {
                relation_id: item.id,
            },
        });
        result.push({
            ...item,
            count: logs.length,
        });
    }
    result.sort((a, b) => b.count - a.count);
    return (
        <div>
            <div style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--foreground-light)',
                paddingLeft: '16px',
            }}>{category.name}</div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px',
                overflowY: 'auto',
                overflowX: 'hidden',
                maxHeight: 'calc(100vh - 160px)',
            }}>
                {
                    result.map(({ id, name, description, icon, link, count }) => {
                        return <Link href={link} key={id} target='_blank'>
                            <ClickLog relationId={id}>
                                <Card className="no-padding" style={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'var(--background-light)',
                                    color: 'var(--foreground-light)',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '10vh',
                                    }}>
                                        <div style={{ marginRight: '8px' }}>
                                            <Avatar src={icon || '/error-icon.png'} style={{ width: '48px', height: '48px' }} />
                                        </div>
                                        <div style={{ width: '200px' }}>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}>
                                                <Tooltip title={name}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        maxWidth: '150px'

                                                    }}>{name}</span></Tooltip>
                                                <span style={{
                                                    fontSize: '8px',
                                                    fontWeight: 400,
                                                    marginLeft: '2px',
                                                }}>点击量: {count}</span>
                                            </div>
                                            <Tooltip title={description}>
                                                <div style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '200px'
                                                }}>{description}</div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </Card>
                            </ClickLog>
                        </Link>;
                    })
                }
            </div>
        </div>
    )
}