import Client from '@/utils/prisma-client';
import '@ant-design/v5-patch-for-react-19';
import { Table } from 'antd';
export default async function Role() {
    
    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'mail',
            key: 'mail',
        },
        {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
        },
    ];
    const users = await Client.user.findMany();
    const dataSource = [];
    for (const { username, mail, roles } of users) {
        const roleIds = roles as number[];
        const names = await Client.role.findMany({
            where: {
                id: {
                    in: roleIds
                }
            },
            select: {
                name: true
            }
        });
        dataSource.push({
            key: username,
            username,
            mail,
            roles: Array.from(new Set(names)).map(role => role.name),
        });
    }
    return <div>
        <Table dataSource={dataSource} columns={columns} />;
    </div>;
}