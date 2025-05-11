import Client from '@/utils/prisma-client';
import '@ant-design/v5-patch-for-react-19';
import { Table } from 'antd';
export default async function Role() {
    
    const columns = [
        {
            title: '角色名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '权限',
            dataIndex: 'permissions',
            key: 'permissions',
        },
    ];
    const roles = await Client.role.findMany();
    const dataSource = [];
    for (const { permissions, name, description } of roles) {
        const permissionData = permissions as number[];
        if (Array.isArray(permissionData) && permissionData.length === 1 && permissionData[0] === -1) {
            console.log(permissions)
            dataSource.push({
                key: name,
                name,
                description,
                permissions: '根用户(全部权限)',
            });
        }
    }
    return <div>
        <Table dataSource={dataSource} columns={columns} />;
    </div>;
}