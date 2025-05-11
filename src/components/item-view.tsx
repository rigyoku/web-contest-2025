'use client';

import Image from 'next/image';
import '@ant-design/v5-patch-for-react-19';
import { Card, Descriptions, } from 'antd';
import { useRouter } from 'next/navigation';
import { ItemTable } from './item-table';

export const ItemsView = ({ category: { id, name, description, icon }, items }: {
    category: {
        id: number;
        name: string;
        description: string | null;
        icon: string | null;
        deleted: number;
        path: string;
    },
    items: {
        category_id: number;
        id: number;
        name: string;
        description: string | null;
        icon: string | null;
        link: string;
        deleted: number;
    }[]
}) => {
    const router = useRouter();
    return (
        <div>
            <div onClick={router.back} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
                cursor: 'pointer',
            }}>
                <Image src={'/back-arrow.svg'} alt='back' width={24} height={24}></Image>
                返回列表
            </div>
            <Card className='small-padding'>
                <Descriptions title={<>
                    类别
                </>} items={[
                    {
                        key: '1',
                        label: '标题',
                        children: <span style={{
                            fontWeight: 600,
                            marginRight: '8px',
                        }}>{name}</span>,
                    },
                    {
                        key: '2',
                        label: '描述',
                        children: <span style={{
                            fontWeight: 600,
                            marginRight: '8px',
                        }}>{description}</span>,
                    },
                    {
                        key: '3',
                        label: icon ? '图标' : '',
                        children: <>
                            {
                                icon && <Image src={icon} alt="icon" width={32} height={32} />
                            }
                        </>,
                    },
                ]} />
            </Card>
            <Card className='small-padding' style={{
                marginTop: '12px',
            }}>
                <ItemTable categoryId={id} items={items}></ItemTable>
            </Card>
        </div>
    )
}